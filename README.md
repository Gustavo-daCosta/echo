# Echo

Um app mobile que conecta seus habitos de escuta do Spotify com a descoberta de shows locais. Veja o que voce ouve, explore suas estatisticas e encontre apresentacoes perto de voce — tudo com os dados armazenados no proprio dispositivo.

## Video - Demo

https://github.com/user-attachments/assets/c6468f01-7ed5-42fe-9a26-3e3f2696043c

## Video - Explicacao do projeto

https://github.com/user-attachments/assets/e60216ff-edaf-4aca-9d09-7fcf06285bb4

## Conceito

O Echo entrega tres funcionalidades em um unico app:

- **Analise de escuta** — top faixas, artistas e caracteristicas de audio por periodos, exibidos em um grid 3x3
- **Radar de shows** — usa o GPS para encontrar apresentacoes em um raio de 30km
- **Privacidade offline-first** — todo o historico de escuta e armazenado em cache local via SQLite; seus dados nunca saem do dispositivo

## Arquitetura

![Diagrama de Arquitetura](https://mermaid.ink/img/eNqtlmtr2zAUhv-KcL-04EAu7dgyGDRJL2OhTevAPjRjKPZxbOJYRpLThrb_fUcXO1YuG4U5EFvRo_fI79GR8uqFLAKvT7wFp0VCpqNZTvAKMyrECGKSsUWakzjNsv5Jt9v1heRsCf2TOL7AyzZbz2kkk363ePFDljGuuuOvO0qSzq1O57P61FKd0eDLxflHpDIW0mwy_F9y8CKB5zSzeu12uxbr9XquUmerNO-pz65YRPFFqYADnrXbUTeOPzKzhPLomfJKrNPp1GKDwedP18N_iBm5QFIuT08vi4KMaZmHydkZabW-kbHK7dPM0_eZ98vQuqX632beZSkTyGUaUgnRzHsjUzoXrzPvvIUP5I6u0wWVjM-89yqWAuxghXTUoFu2AgyjbnWUHa6rOJynFAjq-zGyp8hHGlGuZp6uwTSO4ecKn3CGBqo52CdNG16Uc7P0b63Xv8d0A5wgPIJ1GkLdUYdQ180kQAK_SQC5YNzpvGMyjVW0UiSmoRxMWS4cLMD0qknpO7YAZN0PebQ3wwCtpgsgOmVYAdUPriiEJQfVA0-nqK2bmkTurAk-jFNpGP207T0YG_jauGJD67YT-ZoKeTn5joh9IgMaLpXY315qmLEyUrpXVRXiyB2fCmXhxmjbBvkJc0U64DTFeHKF0YEbuvmLgzelotalXTHXIMOEFBndzHHqek3WsffgIQ0TIJIjKTRqbKxKTgpHVLKCYPdKHFJt4o9AIyJMCRwXvXopGJdkcnejKbWCDKSrwUI3IEnIGI_SHAtY6-GK3ecm98EUwTwEbqLaBBqyyqZhH0rgG_KcykT5SZaw0fuC6_x-iAC9isoMCM2qILowDGnL0s1CVar7drm4Nmw02HVrF1rjPolZwAVpjN3Wyf6-N_kxvCL3avc7FL5JaoFjso3d3A7Sx2lzl9cLyteZ9bVffjVvPEZc0NmffEykrx30zfZRHRXOGLtB-I1Z-caj-pxyeV3VfpVxe846iK5Xf2uJv5P6-jTFUZ5PvBXwFU0j_Ivx6uFhstJ_NvA9l977-x95Vr_W)

O app se comunica diretamente com o Spotify via OAuth PKCE (sem client secret no dispositivo). Os dados de shows passam por um proxy FastAPI rodando na sua maquina, que consulta a API Discovery do Ticketmaster com a chave no lado do servidor.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Mobile | Expo (React Native), TypeScript |
| Navegacao | Expo Router, Material Top Tabs |
| Autenticacao | expo-auth-session (PKCE) |
| Armazenamento | expo-secure-store, expo-sqlite |
| GPS | expo-location |
| Notificacoes | expo-notifications |
| Exportacao | react-native-view-shot + expo-sharing |
| Backend | FastAPI (Python), httpx, geopy, pydantic |
| APIs | Spotify Web API, Ticketmaster Discovery API v2 |

## Estrutura do Projeto

```
echo/
  echo-mobile/        # App Expo
    app/              # Telas (login, home, stats, radar, profile)
    components/       # Componentes compartilhados
    services/         # Clientes de API (spotify, database, location, backend)
    context/          # AuthContext (ciclo de vida OAuth)
    hooks/            # Hooks de dados (useData.ts)
    styles/           # Estilos por tela e por componente
  echo-backend/       # Servidor FastAPI
    main.py           # Entrada da aplicacao, CORS, logging
    routers.py        # GET /health, POST /api/concerts
    services.py       # Proxy Ticketmaster + cruzamento de artistas
    models.py         # Schemas Pydantic
    config.py         # Configuracao de ambiente
```

## Configuracao

### 1. API do Spotify

Crie um app em [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard). Adicione a Redirect URI: `echo://auth/callback`. Copie o Client ID.

### 2. API do Ticketmaster

Obtenha uma chave em [developer.ticketmaster.com](https://developer.ticketmaster.com).

### 3. Variaveis de ambiente

```
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

# Mobile (build de desenvolvimento necessario para notificacoes e suporte nativo completo)
cd echo-mobile
npm install
npx expo run:android
# Ou conecte o celular via USB para instalar direto
```

## Detalhes da Implementacao

- **OAuth PKCE** — sem client secret no dispositivo; o code verifier e armazenado no SecureStore antes do redirect e recuperado pela tela de callback para a troca do token
- **Sincronizacao SQLite** — o endpoint de ouvidas recentes do Spotify alimenta o banco local a cada carregamento da Home; as estatisticas diarias sao agregadas a partir desse cache
- **Proxy do backend** — o FastAPI recebe coordenadas do app, consulta o Ticketmaster com a chave do servidor, cruza nomes de artistas para tags de correspondencia e retorna ate 15 eventos ordenados por data
- **Exportacao** — o grid de estatisticas e capturado via `react-native-view-shot` e compartilhado pelo menu nativo como PNG
- **Navegacao por deslize** — Material Top Tabs posicionados na parte inferior fornecem navegacao nativa por arrasto entre telas com suporte a safe area

## Atendimento aos Requisitos

| Requisito | Como o Echo atende |
|-----------|-------------------|
| Aplicacao mobile | Expo (React Native) — app nativo Android, nao web responsivo |
| Multiplas telas | 5 telas: Login, Home, Stats, Radar, Profile |
| Navegacao funcional | Tab Navigator com deslize entre telas + Stack Navigator para fluxo de auth |
| Backend funcional | FastAPI (Python) proprio — proxy seguro para Ticketmaster |
| Banco de dados | SQLite local (expo-sqlite) — historico de escuta offline-first |
| API externa | Duas: Spotify Web API (dados musicais) e Ticketmaster Discovery API (shows) |
| Notificacoes | Notificacao local ao detectar shows proximos (expo-notifications) |
| Compartilhamento | Exportacao do grid de estatisticas como PNG via share sheet nativo |
| Hardware do celular | GPS (expo-location) para geolocalizacao e descoberta de shows no raio de 30km |
| Tratamento de erros | Loading skeletons, fallbacks para API offline, mensagens de estado vazio |
| Documentacao | README com conceito, stack, arquitetura e instrucoes de execucao |
| Codigo-fonte | Repositorio publico organizado com separacao por responsabilidade |
