-- Create a function to confirm user emails
create or replace function confirm_user(user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update auth.users
  set email_confirmed_at = now(),
      confirmed_at = now()
  where id = user_id;
end;
$$; 