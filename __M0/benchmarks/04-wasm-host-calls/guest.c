__attribute__((import_module("feluka"), import_name("owner_matches")))
extern int owner_matches(int owner_id, int user_id);

__attribute__((export_name("can_read")))
int can_read(int owner_id, int user_id, int is_public) {
    return is_public || owner_matches(owner_id, user_id);
}
