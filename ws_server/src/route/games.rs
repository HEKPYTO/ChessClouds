use axum::extract::State;

use crate::state::AppState;

// for debugging, might remove this later
pub async fn get_games(State(state): State<AppState>) -> String {
    tracing::info!("/GET games");
    let mut s = String::new();
    state.active_games.scan(|k, v| {
        s = format!(
            "{s}\n{{Game: {k}, Black: {}, White: {}}}",
            v.black_user_id, v.white_user_id
        );
    });
    s
}
