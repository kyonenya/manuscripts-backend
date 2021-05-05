CREATE TABLE entries (
    text text NOT NULL,
    starred boolean DEFAULT false,
    uuid character varying(32) PRIMARY KEY,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    modified_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    uuid character varying(32) NOT NULL,
    tag character varying(255) NOT NULL,
    foreign key (uuid) references entries(uuid) on delete cascade
);
