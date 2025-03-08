# Row Level Security (RLS) in JU Research Portal

This document explains the Row Level Security (RLS) setup for the JU Research Portal database.

## What is RLS?

Row Level Security (RLS) is a security feature in PostgreSQL that allows you to restrict which rows a user can access in a table. It's a powerful way to implement access control at the database level.

## Our RLS Setup

Our RLS setup is designed to balance security and functionality:

1. **Public Read Access**: All users (including anonymous users) can read data from most tables. This allows the application to display professors, students, publications, etc. without requiring authentication.

2. **Authenticated Write Access**: Only authenticated users can write data to the database. This prevents unauthorized users from modifying the data.

3. **Owner-Based Write Access**: Users can only modify their own data. For example, a professor can only update their own profile, not someone else's.

## RLS Policies

Here are the main RLS policies we've implemented:

### Read Access

- Anyone can read data from all tables (faculties, departments, professors, students, publications, etc.)

### Write Access

- Professors can update their own profiles
- Students can update their own profiles
- Users can create and update their own connection requests
- Professors can add and delete their own research keywords
- Students can add and delete their own research keywords
- Authenticated users can insert publications
- Users can update their own publications
- Authenticated users can insert publication authors
- Users can update their own publication authors
- Authenticated users can insert research keywords

## How to Apply RLS

To apply the RLS policies, run the SQL file `20240724000025_proper_rls_setup.sql` in the Supabase SQL Editor.

## Best Practices

1. **Always use the anon key in client-side code**: The anon key has limited permissions and is safe to use in client-side code.

2. **Never use the service role key in client-side code**: The service role key bypasses RLS and should only be used in server-side code.

3. **Test your RLS policies**: Use the `check-supabase-direct.html` file to test your RLS policies with both the anon key and service role key.

4. **Keep your RLS policies up to date**: When you add new tables or features, make sure to update your RLS policies accordingly.

## Troubleshooting

If you encounter permission errors:

1. **Check the error message**: The error message will tell you which table and operation is causing the issue.

2. **Check your RLS policies**: Make sure you have the appropriate RLS policies for the table and operation.

3. **Test with the service role key**: If it works with the service role key but not the anon key, it's likely an RLS issue.

4. **Check your authentication**: Make sure you're authenticated if you're trying to perform an operation that requires authentication.

## Further Reading

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) 