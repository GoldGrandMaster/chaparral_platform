# Initial Environment
- Node.js
    ```
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

    source ~/.bashrc

    nvm install v20.10.0
    ```
- Java
    ```
    sudo apt install openjdk-21-jdk
    ```
# Frontend : we may not need this if we don't use tauri
- Rust
    ```
    sudo apt update
    sudo apt install libwebkit2gtk-4.1-dev \
        build-essential \ 
        curl \
        wget \
        file \
        libssl-dev \
        libgtk-3-dev \
        libayatana-appindicator3-dev \
        librsvg2-dev \
        libsoup-3.0-dev \
        libjavascriptcoregtk-4.1-dev
    curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
    ```
# Backend
- Postgresql (not required when using docker)
    ```
    sudo apt-get install postgresql

    sudo -i -u postgres
    psql
    ALTER USER postgres PASSWORD 'admin';
    ```
# Configuration
`chaparral_pf-main/src/main/resources/config/application.yml`
```
spring:
    sendgrid:
        api-key:

aws:
  access-key:
  secret-key:
  region:
  s3-bucket-name:
  multipart-min-part-size: # 5MB
```
`chaparral_client-main/src/config.tsx`
```
const config = {
    backend_url: 'http://localhost:8080/api/', # backend url
};
```
# Running project
- Fronend
    ```
    npm run dev //Web localhost:1420
    npm run tauri dev //App
    ```
- backend
    - Without docker
        ```
        ./gradlew
        ```
    - Using docker
        - Build image
            ```
            npm run java:docker
            ```
        - Run
            ```
            docker compose -f src/main/docker/app.yml up -d
            ```