use tauri::State;
use tokio::sync::Mutex;
use crate::ipc::sidecar::Sidecar;
use crate::AppError;

#[tauri::command]
pub async fn browser_launch(sidecar: State<'_, Mutex<Sidecar>>) -> Result<serde_json::Value, AppError> {
    let mut sc = sidecar.lock().await;
    sc.call("browser.launch", None).await
}

#[tauri::command]
pub async fn browser_close(sidecar: State<'_, Mutex<Sidecar>>) -> Result<serde_json::Value, AppError> {
    let mut sc = sidecar.lock().await;
    sc.call("browser.close", None).await
}

#[tauri::command]
pub async fn browser_navigate(sidecar: State<'_, Mutex<Sidecar>>, url: String) -> Result<serde_json::Value, AppError> {
    let mut sc = sidecar.lock().await;
    sc.call("browser.navigate", Some(serde_json::json!({"url": url}))).await
}

#[tauri::command]
pub async fn browser_status(sidecar: State<'_, Mutex<Sidecar>>) -> Result<serde_json::Value, AppError> {
    let mut sc = sidecar.lock().await;
    sc.call("browser.status", None).await
}

#[tauri::command]
pub async fn recording_start(sidecar: State<'_, Mutex<Sidecar>>) -> Result<serde_json::Value, AppError> {
    let mut sc = sidecar.lock().await;
    sc.call("recording.start", None).await
}

#[tauri::command]
pub async fn recording_stop(sidecar: State<'_, Mutex<Sidecar>>) -> Result<serde_json::Value, AppError> {
    let mut sc = sidecar.lock().await;
    sc.call("recording.stop", None).await
}

#[tauri::command]
pub async fn recording_poll(sidecar: State<'_, Mutex<Sidecar>>) -> Result<serde_json::Value, AppError> {
    let mut sc = sidecar.lock().await;
    sc.call("recording.poll", None).await
}

#[tauri::command]
pub async fn workflow_execute(sidecar: State<'_, Mutex<Sidecar>>, workflow: serde_json::Value) -> Result<serde_json::Value, AppError> {
    let mut sc = sidecar.lock().await;
    sc.call("workflow.execute", Some(serde_json::json!({"workflow": workflow}))).await
}

#[tauri::command]
pub async fn workflow_stop_execution(sidecar: State<'_, Mutex<Sidecar>>) -> Result<serde_json::Value, AppError> {
    let mut sc = sidecar.lock().await;
    sc.call("workflow.stop", None).await
}

#[tauri::command]
pub async fn workflow_execution_status(sidecar: State<'_, Mutex<Sidecar>>) -> Result<serde_json::Value, AppError> {
    let mut sc = sidecar.lock().await;
    sc.call("workflow.execution_status", None).await
}
