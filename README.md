# Echo

Um app mobile que conecta seus hábitos de escuta do Spotify com a descoberta de shows locais. Veja o que você ouve, explore suas estatísticas e encontre apresentações perto de você — tudo com os dados armazenados no próprio dispositivo.

## Vídeo - Demo

https://github.com/user-attachments/assets/c6468f01-7ed5-42fe-9a26-3e3f2696043c

## Vídeo - Explicação do projeto

https://github.com/user-attachments/assets/e60216ff-edaf-4aca-9d09-7fcf06285bb4

## Conceito

O Echo entrega três funcionalidades em um único app:

* **Análise de escuta** — top faixas, artistas e características de áudio por períodos, exibidos em um grid 3x3
* **Radar de shows** — usa o GPS para encontrar apresentações em um raio de 30 km
* **Privacidade offline-first** — todo o histórico de escuta é armazenado em cache local via SQLite; seus dados nunca saem do dispositivo

## Arquitetura

<img width="4605" height="2529" alt="image" src="https://github.com/user-attachments/assets/81d59be9-1620-4917-8b20-9fddf2a1dd9c" />

O app se comunica diretamente com o Spotify via OAuth PKCE (sem client secret no dispositivo). Os dados de shows passam por um proxy FastAPI rodando na sua máquina, que consulta a API Discovery do Ticketmaster com a chave no lado do servidor.

## Stack

| Camada        | Tecnologia                                     |
| ------------- | ---------------------------------------------- |
| Mobile        | Expo (React Native), TypeScript                |
| Navegação     | Expo Router, Material Top Tabs                 |
| Autenticação  | expo-auth-session (PKCE)                       |
| Armazenamento | expo-secure-store, expo-sqlite                 |
| GPS           | expo-location                                  |
| Notificações  | expo-notifications                             |
| Exportação    | react-native-view-shot + expo-sharing          |
| Backend       | FastAPI (Python), httpx, geopy, pydantic       |
| APIs          | Spotify Web API, Ticketmaster Discovery API v2 |

## Estrutura do Projeto

```text
echo/
  echo-mobile/        # App Expo
    app/              # Telas (login, home, stats, radar, profile)
    components/       # Componentes compartilhados
    services/         # Clientes de API (spotify, database, location, backend)
    context/          # AuthContext (ciclo de vida OAuth)
    hooks/            # Hooks de dados (useData.ts)
    styles/           # Estilos por tela e por componente
  echo-backend/       # Servidor FastAPI
    main.py           # Entrada da aplicação, CORS, logging
    routers.py        # GET /health, POST /api/concerts
    services.py       # Proxy Ticketmaster + cruzamento de artistas
    models.py         # Schemas Pydantic
    config.py         # Configuração de ambiente
```

## Configuração

### 1. API do Spotify

Crie um app em [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard). Adicione a Redirect URI: `echo://auth/callback`. Copie o Client ID.

### 2. API do Ticketmaster

Obtenha uma chave em [developer.ticketmaster.com](https://developer.ticketmaster.com).

### 3. Variáveis de ambiente

```bash
# echo-mobile/.env
EXPO_PUBLIC_SPOTIFY_CLIENT_ID=seu_client_id
EXPO_PUBLIC_BACKEND_URL=http://seu_ip_da_rede:8000

# echo-backend/.env
TICKETMASTER_API_KEY=sua_chave
```

### 4. Instalar e Rodar

```bash
# Backend
cd echo-backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000

# Mobile (build de desenvolvimento necessário para notificações e suporte nativo completo)
cd echo-mobile
npm install
npx expo run:android
# Ou conecte o celular via USB para instalar direto
```

## Detalhes da Implementação

* **OAuth PKCE** — sem client secret no dispositivo; o code verifier é armazenado no SecureStore antes do redirect e recuperado pela tela de callback para a troca do token
* **Sincronização SQLite** — o endpoint de ouvidas recentes do Spotify alimenta o banco local a cada carregamento da Home; as estatísticas diárias são agregadas a partir desse cache
* **Proxy do backend** — o FastAPI recebe coordenadas do app, consulta o Ticketmaster com a chave do servidor, cruza nomes de artistas para tags de correspondência e retorna até 15 eventos ordenados por data
* **Exportação** — o grid de estatísticas é capturado via `react-native-view-shot` e compartilhado pelo menu nativo como PNG
* **Navegação por deslize** — Material Top Tabs posicionados na parte inferior fornecem navegação nativa por arrasto entre telas com suporte a safe area

## Atendimento aos Requisitos

| Requisito           | Como o Echo atende                                                                 |
| ------------------- | ---------------------------------------------------------------------------------- |
| Aplicação mobile    | Expo (React Native) — app nativo Android, não web responsivo                       |
| Múltiplas telas     | 5 telas: Login, Home, Stats, Radar, Profile                                        |
| Navegação funcional | Tab Navigator com deslize entre telas + Stack Navigator para fluxo de autenticação |
| Backend funcional   | FastAPI (Python) próprio — proxy seguro para Ticketmaster                          |
| Banco de dados      | SQLite local (expo-sqlite) — histórico de escuta offline-first                     |
| API externa         | Duas: Spotify Web API (dados musicais) e Ticketmaster Discovery API (shows)        |
| Notificações        | Notificação local ao detectar shows próximos (expo-notifications)                  |
| Compartilhamento    | Exportação do grid de estatísticas como PNG via share sheet nativo                 |
| Hardware do celular | GPS (expo-location) para geolocalização e descoberta de shows no raio de 30 km     |
| Tratamento de erros | Loading skeletons, fallbacks para API offline, mensagens de estado vazio           |
| Documentação        | README com conceito, stack, arquitetura e instruções de execução                   |
| Código-fonte        | Repositório público organizado com separação por responsabilidade                  |
