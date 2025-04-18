pub mod message;
pub mod route;
pub mod state;

pub const MAX_CHANNEL_CAPACITY: usize = 64;
pub const HOST: &'static str = "0.0.0.0:8000";
pub const MAX_DB_CONNECTIONS: u32 = 5;
pub const DEFERRED_REMOVAL_DURATION: u64 = 60;
