// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest;
use std::collections::HashMap;
use std::process::Command;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn login(username: &str, password: &str) -> Result<String, String> {
    let mut map = HashMap::new();
    map.insert("username", username);
    map.insert("password", password);
    map.insert("rememberme", "false");
    let client = reqwest::Client::new();
    let body = client
        .post("http:localhost:8080/api/authenticate")
        .json(&map)
        .send()
        .await
        .unwrap()
        .text()
        .await
        .unwrap();

    println!("body = {:?}", body);

    Ok(body)
}

#[tauri::command]
async fn signup(
    username: &str,
    email: &str,
    password: &str,
    lang_key: &str,
) -> Result<String, String> {
    let mut map: HashMap<&str, &str> = HashMap::new();
    println!("{username} {email} {password} {lang_key}");
    map.insert("login", username);
    map.insert("email", email);
    map.insert("password", password);
    map.insert("langKey", lang_key);
    let client = reqwest::Client::new();
    let body = client
        .post("http:localhost:8080/api/register")
        .json(&map)
        .send()
        .await
        .unwrap()
        .text()
        .await
        .unwrap();

    println!("body = {:?}", body);

    Ok(body)
}

#[tauri::command]
async fn get_account(authorization: &str) -> Result<String, String> {
    let client = reqwest::Client::new();
    let body = client
        .get("http:localhost:8080/api/account")
        .header("Authorization", authorization)
        .send()
        .await
        .unwrap()
        .text()
        .await
        .unwrap();

    println!("body = {:?}", body);

    Ok(body)
}

#[tauri::command]
async fn confirm(activation_key: &str) -> Result<String, String> {
    let client = reqwest::Client::new();

    let body = client
        .get("http:localhost:8080/api/activate?key=".to_owned() + activation_key)
        .send()
        .await
        .unwrap()
        .text()
        .await
        .unwrap();

    println!("body = {:?}", body);

    Ok(body)
}

#[tauri::command]
async fn send_password_reset_request(email: &str) -> Result<String, String> {
    let client = reqwest::Client::new();
    let email = String::from(email);
    let body = client
        .post("http:localhost:8080/api/account/reset-password/init")
        .body(email)
        .send()
        .await
        .unwrap()
        .text()
        .await
        .unwrap();

    println!("body = {:?}", body);

    Ok(body)
}

#[tauri::command]
async fn password_reset(reset_key: &str, new_password: &str) -> Result<String, String> {
    let mut map: HashMap<&str, &str> = HashMap::new();
    println!("{reset_key} {new_password}");
    map.insert("key", reset_key);
    map.insert("newPassword", new_password);
    let client = reqwest::Client::new();

    let body = client
        .post("http:localhost:8080/api/account/reset-password/finish")
        .json(&map)
        .send()
        .await
        .unwrap()
        .text()
        .await
        .unwrap();

    println!("body = {:?}", body);

    Ok(body)
}

#[tauri::command]
fn call_cli(res_path: &str) {
    println!("Obtained file/foler path: {res_path}");
    let output = Command::new("./src/sage/sage_mac")
        .args([
            "-f",
            "./src/sage/small.fasta",
            "-o",
            "./src/sage",
            "./src/sage/config.json",
            "./src/sage/test.mzML",
        ])
        .output()
        .expect("CLI program crashed");

    println!("status: {}", output.status);
    println!("stdout: {}", String::from_utf8_lossy(&output.stdout));
    println!("stderr: {}", String::from_utf8_lossy(&output.stderr));
}

#[tauri::command]
async fn get_projects(authorization: &str, page: i8, size: i8) -> Result<String, String> {
    let client = reqwest::Client::new();
    let url = format!(
        "http://localhost:8080/api/projects?page={}&size={}",
        page, size
    );

    let response = client
        .get(url)
        .header("Authorization", authorization)
        .send()
        .await
        .unwrap()
        .text()
        .await
        .unwrap();

    println!("Projects: {:?}", response);

    Ok(response)
}

#[tauri::command]
async fn save_project(authorization: &str, project: &str) -> Result<String, String> {
    println!("Project: {:?}", project);

    let project = String::from(project);
    let client = reqwest::Client::new();

    let response = client
        .post("http://localhost:8080/api/projects")
        .header("Authorization", authorization)
        .header("Content-Type", "application/json")
        .body(project)
        .send()
        .await
        .unwrap()
        .text()
        .await
        .unwrap();

    println!("Response: {:?}", response);

    Ok(response)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            login,
            get_account,
            signup,
            confirm,
            send_password_reset_request,
            password_reset,
            call_cli,
            get_projects,
            save_project
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
