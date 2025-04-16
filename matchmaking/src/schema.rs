// @generated automatically by Diesel CLI.

diesel::table! {
    activegames (gameid) {
        gameid -> Uuid,
        black -> Text,
        white -> Text,
        createdat -> Nullable<Timestamp>,
    }
}

diesel::table! {
    gamehistory (gameid) {
        gameid -> Uuid,
        playera -> Text,
        playerb -> Text,
        pgn -> Text,
        createdat -> Nullable<Timestamp>,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    activegames,
    gamehistory,
);
