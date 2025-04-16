use chrono::NaiveDateTime;
use diesel::prelude::*;
use uuid::Uuid;

#[derive(Queryable, Debug, Insertable)]
#[diesel(primary_key(gameid))]
#[diesel(table_name = crate::schema::activegames)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Activegame {
    pub gameid: Uuid,
    pub black: String,
    pub white: String,
    pub createdat: Option<NaiveDateTime>,
}
