## Environment setup
- Install Git
```
sudo apt update
sudo apt install git
```
- Install Node.js
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

source ~/.bashrc

nvm install v20.10.0
```
- Install rust(frontend)
```
sudo apt install curl build-essential gcc make -y
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```
- Install IntelliJIDEA
    
    Open "Ubuntu Software" on the taskbar and install IntelliJIDEA
- Set JAVA_HOME
```
nano ~/.bashrc
```

Add below line to the end and save

```
export JAVA_HOME="/home/giant/.jdks/openjdk-21.0.2"
```
And then, run this command
```
source ~/.bashrc
```
- Install Postgresql
```
sudo apt-get install postgresql

curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo apt-key add

sudo sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/focal/ pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'

sudo apt install pgadmin4

sudo -i -u postgres
psql
ALTER USER postgres PASSWORD 'admin';
```

## Running project
- Fronend
```
npm run dev //Web
npm run tauri dev //App
```
- backend
```
./gradlew -x webapp
```
