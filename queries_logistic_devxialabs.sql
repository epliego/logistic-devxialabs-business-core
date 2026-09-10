CREATE DATABASE logistic_devxialabs
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LOCALE_PROVIDER = 'libc'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

COMMENT ON DATABASE logistic_devxialabs
    IS 'Database Logistic DevxIA Labs';

CREATE TABLE internal_user (
id SERIAL PRIMARY KEY,
email VARCHAR(255) NOT NULL UNIQUE,
name VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
active INT NOT NULL DEFAULT 1,
insert_date TIMESTAMP NOT NULL DEFAULT NOW(),
insert_by_internal INT NOT NULL DEFAULT 1,
update_date TIMESTAMP NULL,
update_by_internal INT NULL
);

COMMENT ON COLUMN public.internal_user.id
    IS 'Unique identifier';

COMMENT ON COLUMN public.internal_user.email
    IS 'Internal user email';

COMMENT ON COLUMN public.internal_user.name
    IS 'Internal user name';

COMMENT ON COLUMN public.internal_user.password
    IS 'Hashed password';

COMMENT ON COLUMN public.internal_user.active
    IS 'Active register boolean atribute';

COMMENT ON COLUMN public.internal_user.insert_date
    IS 'Insert date registry';

COMMENT ON COLUMN public.internal_user.insert_by_internal
    IS 'Internal user that inserted the registry';

COMMENT ON COLUMN public.internal_user.update_date
    IS 'Update date registry';

COMMENT ON COLUMN public.internal_user.update_by_internal
    IS 'Internal user that updated the registry';

CREATE INDEX idx_internal_user_email ON public.internal_user(email);

CREATE INDEX idx_internal_user_active ON public.internal_user(active);

CREATE TABLE internal_user_profile (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
active INT NOT NULL DEFAULT 1,
insert_date TIMESTAMP NOT NULL DEFAULT NOW(),
insert_by_internal INT NOT NULL DEFAULT 1,
update_date TIMESTAMP NULL,
update_by_internal INT NULL
);

COMMENT ON COLUMN public.internal_user_profile.id
    IS 'Unique identifier';

COMMENT ON COLUMN public.internal_user_profile.name
    IS 'Internal user profile name';

COMMENT ON COLUMN public.internal_user_profile.active
    IS 'Active register boolean atribute';

COMMENT ON COLUMN public.internal_user_profile.insert_date
    IS 'Insert date registry';

COMMENT ON COLUMN public.internal_user_profile.insert_by_internal
    IS 'Internal user that inserted the registry';

COMMENT ON COLUMN public.internal_user_profile.update_date
    IS 'Update date registry';

COMMENT ON COLUMN public.internal_user_profile.update_by_internal
    IS 'Internal user that updated the registry';

CREATE INDEX idx_internal_user_profile_active ON public.internal_user_profile(active);

CREATE TABLE internal_user_by_profile (
id SERIAL PRIMARY KEY,
internal_user_id INT NOT NULL,
internal_user_profile_id INT NOT NULL,
active INT NOT NULL DEFAULT 1,
insert_date TIMESTAMP NOT NULL DEFAULT NOW(),
insert_by_internal INT NOT NULL DEFAULT 1,
update_date TIMESTAMP NULL,
update_by_internal INT NULL
);

COMMENT ON COLUMN public.internal_user_by_profile.id
    IS 'Unique identifier';

COMMENT ON COLUMN public.internal_user_by_profile.internal_user_id
    IS 'Internal user ID';

COMMENT ON COLUMN public.internal_user_by_profile.internal_user_profile_id
    IS 'Internal user profile ID';

COMMENT ON COLUMN public.internal_user_by_profile.active
    IS 'Active register boolean atribute';

COMMENT ON COLUMN public.internal_user_by_profile.insert_date
    IS 'Insert date registry';

COMMENT ON COLUMN public.internal_user_by_profile.insert_by_internal
    IS 'Internal user that inserted the registry';

COMMENT ON COLUMN public.internal_user_by_profile.update_date
    IS 'Update date registry';

COMMENT ON COLUMN public.internal_user_by_profile.update_by_internal
    IS 'Internal user that updated the registry';

CREATE INDEX idx_internal_user_by_profile_internal_user_id ON public.internal_user_by_profile(internal_user_id);

CREATE INDEX idx_internal_user_by_profile_internal_user_profile_id ON public.internal_user_by_profile(internal_user_profile_id);

CREATE INDEX idx_internal_user_by_profile_active ON public.internal_user_by_profile(active);

CREATE TABLE shipment (
id SERIAL PRIMARY KEY,
guide_code VARCHAR(255) NOT NULL UNIQUE,
provenance_direction VARCHAR(255) NOT NULL,
destination_direction VARCHAR(255) NOT NULL,
recipient_name VARCHAR(255) NOT NULL,
recipient_phone VARCHAR(255) NULL,
weight_kg NUMERIC NOT NULL CHECK (weight_kg > 0),
status_id INT NOT NULL DEFAULT 1,
active INT NOT NULL DEFAULT 1,
insert_date TIMESTAMP NOT NULL DEFAULT NOW(),
insert_by_internal INT NOT NULL DEFAULT 1,
update_date TIMESTAMP NULL,
update_by_internal INT NULL
);

COMMENT ON COLUMN public.shipment.id
    IS 'Unique identifier';

COMMENT ON COLUMN public.shipment.guide_code
    IS 'Guide code (Tracking)';

COMMENT ON COLUMN public.shipment.provenance_direction
    IS 'Provenance direction';

COMMENT ON COLUMN public.shipment.destination_direction
    IS 'Destination direction';

COMMENT ON COLUMN public.shipment.recipient_name
    IS 'Recipient name';

COMMENT ON COLUMN public.shipment.recipient_phone
    IS 'Recipient phone';

COMMENT ON COLUMN public.shipment.weight_kg
    IS 'Weight (Kg)';

COMMENT ON COLUMN public.shipment.status_id
    IS 'Shipment status ID';

COMMENT ON COLUMN public.shipment.active
    IS 'Active register boolean atribute';

COMMENT ON COLUMN public.shipment.insert_date
    IS 'Insert date registry';

COMMENT ON COLUMN public.shipment.insert_by_internal
    IS 'Internal user that inserted the registry';

COMMENT ON COLUMN public.shipment.update_date
    IS 'Update date registry';

COMMENT ON COLUMN public.shipment.update_by_internal
    IS 'Internal user that updated the registry';

CREATE INDEX idx_shipment_status_id ON public.shipment(status_id);

CREATE INDEX idx_shipment_active ON public.shipment(active);

CREATE INDEX idx_shipment_insert_by_internal ON public.shipment(insert_by_internal);

CREATE INDEX idx_shipment_update_by_internal ON public.shipment(update_by_internal);

CREATE TABLE values_catalog (
id SERIAL PRIMARY KEY,
category VARCHAR(255) NOT NULL,
name VARCHAR(255) NOT NULL,
active INT NOT NULL DEFAULT 1,
insert_date TIMESTAMP NOT NULL DEFAULT NOW(),
insert_by_internal INT NOT NULL DEFAULT 1,
update_date TIMESTAMP NULL,
update_by_internal INT NULL
);

COMMENT ON COLUMN public.values_catalog.id
    IS 'Unique identifier';

COMMENT ON COLUMN public.values_catalog.category
    IS 'Values catalog category';

COMMENT ON COLUMN public.values_catalog.name
    IS 'Values catalog item name';

COMMENT ON COLUMN public.values_catalog.active
    IS 'Active register boolean atribute';

COMMENT ON COLUMN public.values_catalog.insert_date
    IS 'Insert date registry';

COMMENT ON COLUMN public.values_catalog.insert_by_internal
    IS 'Internal user that inserted the registry';

COMMENT ON COLUMN public.values_catalog.update_date
    IS 'Update date registry';

COMMENT ON COLUMN public.values_catalog.update_by_internal
    IS 'Internal user that updated the registry';

CREATE INDEX idx_values_catalog_category ON public.values_catalog(category);

CREATE INDEX idx_values_catalog_name ON public.values_catalog(name);

CREATE INDEX idx_values_catalog_active ON public.values_catalog(active);

CREATE TABLE shipment_tracking_history (
id SERIAL PRIMARY KEY,
shipment_id INT NOT NULL,
status_id INT NOT NULL DEFAULT 1,
active INT NOT NULL DEFAULT 1,
insert_date TIMESTAMP NOT NULL DEFAULT NOW(),
insert_by_internal INT NOT NULL DEFAULT 1,
update_date TIMESTAMP NULL,
update_by_internal INT NULL
);

COMMENT ON COLUMN public.shipment_tracking_history.id
    IS 'Unique identifier';

COMMENT ON COLUMN public.shipment_tracking_history.shipment_id
    IS 'Shipment ID';

COMMENT ON COLUMN public.shipment_tracking_history.status_id
    IS 'Shipment status ID';

COMMENT ON COLUMN public.shipment_tracking_history.active
    IS 'Active register boolean atribute';

COMMENT ON COLUMN public.shipment_tracking_history.insert_date
    IS 'Insert date registry';

COMMENT ON COLUMN public.shipment_tracking_history.insert_by_internal
    IS 'Internal user that inserted the registry';

COMMENT ON COLUMN public.shipment_tracking_history.update_date
    IS 'Update date registry';

COMMENT ON COLUMN public.shipment_tracking_history.update_by_internal
    IS 'Internal user that updated the registry';

CREATE INDEX idx_shipment_tracking_history_shipment_id ON public.shipment_tracking_history(shipment_id);

CREATE INDEX idx_shipment_tracking_history_status_id ON public.shipment_tracking_history(status_id);

CREATE INDEX idx_shipment__tracking_history_status_insert_by_internal ON public.shipment(insert_by_internal);

CREATE INDEX idx_shipment__tracking_history_status_update_by_internal ON public.shipment(update_by_internal);

--------------------------------------------------------------------------------------------------
INSERT INTO values_catalog(category,name) VALUES ('SHIPMENT STATUS', 'REGISTRADO');
INSERT INTO values_catalog(category,name) VALUES ('SHIPMENT STATUS', 'EN ALMACÉN');
INSERT INTO values_catalog(category,name) VALUES ('SHIPMENT STATUS', 'EN TRÁNSITO');
INSERT INTO values_catalog(category,name) VALUES ('SHIPMENT STATUS', 'DEVUELTO');
INSERT INTO values_catalog(category,name) VALUES ('SHIPMENT STATUS', 'ENTREGADO');
INSERT INTO values_catalog(category,name) VALUES ('SHIPMENT STATUS', 'CANCELADO');

INSERT INTO internal_user(email,name,password) VALUES ('admin@logisticdeviaxlabs.com', 'Admin DevxIA Labs', '545d51b3c4f5ff8de67660daa021b73e018dff08');

INSERT INTO internal_user_profile(name) VALUES ('Supervisor');
INSERT INTO internal_user_profile(name) VALUES ('Operador');

INSERT INTO internal_user_by_profile(internal_user_id,internal_user_profile_id) VALUES (1, 1);
