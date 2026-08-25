-- Payment.method agora é opcional: só sabemos o método (Pix/boleto/cartão)
-- depois que o cliente escolhe na página do Mercado Pago (Checkout Pro).
ALTER TABLE "Payment" ALTER COLUMN "method" DROP NOT NULL;
