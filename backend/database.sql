CREATE DATABASE history_db;

USE history_db;

CREATE TABLE historical_events (
    id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(255) NOT NULL,
    description NTEXT,
    date DATE,
    location NVARCHAR(255),
    period NVARCHAR(100),
    image_url NVARCHAR(500),
    thumbnail_url NVARCHAR(500),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE historical_figures (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    birth_date DATE,
    death_date DATE,
    biography NTEXT,
    portrait_url NVARCHAR(500),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE event_figure_relations (
    id INT PRIMARY KEY IDENTITY(1,1),
    event_id INT,
    figure_id INT,
    relationship_type NVARCHAR(100),
    FOREIGN KEY (event_id) REFERENCES historical_events(id),
    FOREIGN KEY (figure_id) REFERENCES historical_figures(id)
);

CREATE TABLE historical_images (
    id INT PRIMARY KEY IDENTITY(1,1),
    image_url NVARCHAR(500) NOT NULL,
    caption NVARCHAR(500),
    source NVARCHAR(255),
    event_id INT,
    figure_id INT,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (event_id) REFERENCES historical_events(id),
    FOREIGN KEY (figure_id) REFERENCES historical_figures(id)
); 