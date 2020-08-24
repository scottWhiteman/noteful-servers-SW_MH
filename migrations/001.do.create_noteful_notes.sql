CREATE TABLE notes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    modified TIMESTAMPTZ DEFAULT now() NOT NULL,
    folder_id INTEGER
        REFERENCES noteful_server(id) ON DELETE CASCADE NOT NULL,
    content
);