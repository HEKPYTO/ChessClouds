use axum::extract::State;

use crate::game_state::GameStateMap;

// for debugging, might remove this later
pub async fn get_games(State(state): State<GameStateMap>) -> String {
    let mut s = String::new();
    state.scan(|k, v| {
        s = format!(
            "{s}\n{{Game: {k}, Black: {}, White: {}}}",
            v.black_user_id, v.white_user_id
        );
    });
    s
}
