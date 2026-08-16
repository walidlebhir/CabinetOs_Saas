-- ==========================================
-- V1: Add soft delete (deleted_at) columns
-- to all business entities
-- ==========================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE medecin ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE patient ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE secretaire ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE cabinet ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE rendezvous ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE dossier_medical ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE ordonnance ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE disponibilite_medcin ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE indisponibilite ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE notification ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE avis ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE abonnement ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
ALTER TABLE paiement ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;

-- Partial unique indexes: allow reuse of unique values after soft delete
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_active ON users(email) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_medecin_numero_order_active ON medecin(numero_order) WHERE deleted_at IS NULL;

-- Add isActive column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
