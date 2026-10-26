#![no_std]

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct RecordScope {
    pub owner_id: u32,
    pub public: bool,
}

pub const fn can_read(record: RecordScope, user_id: Option<u32>) -> bool {
    record.public || matches!(user_id, Some(id) if id == record.owner_id)
}
