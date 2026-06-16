-include .env
export

export PROJECT_ROOT=.
BACKEND_PORT ?= 3000

env-up:
	@docker compose up -d elostats-postgres

env-down:
	@docker compose down elostats-postgres

env-cleanup:
	@read -p "clean up all the volume files of the environment? data might be vanished! [y/n]: " ans; \
	if [ "$$ans" = "y" ]; then \
		docker compose down elostats-postgres && \
		rm -rf out/pgdata && \
		echo "environment files are cleaned up."; \
	else \
		echo "cleanup aborted."; \
	fi

prisma-generate:
	@cd backend && npx prisma generate

prisma-migrate:
	@cd backend && npx prisma migrate dev

prisma-migrate-deploy:
	@cd backend && npx prisma migrate deploy

prisma-studio:
	@cd backend && npx prisma studio

prisma-db-push:
	@cd backend && npx prisma db push

prisma-seed:
	@cd backend && npm run seed

backend-stop:
	@pid=$$(lsof -tiTCP:$(BACKEND_PORT) -sTCP:LISTEN); \
	if [ -n "$$pid" ]; then \
		kill $$pid && echo "stopped backend process on port $(BACKEND_PORT): $$pid"; \
	else \
		echo "no backend process is listening on port $(BACKEND_PORT)"; \
	fi

backend-dev: backend-stop
	@cd backend && npm run dev

frontend-dev:
	@cd frontend && npm run dev

deps-graph-frontend:
	@cd frontend && npm run deps:graph

deps-graph-backend:
	@cd backend && npm run deps:graph

deps-graph-fullstack:
	@mkdir -p reports/architecture
	@./frontend/node_modules/.bin/depcruise --config .dependency-cruiser.graph.cjs --output-type dot frontend/src backend/src | dot -Tsvg -o reports/architecture/fullstack-dependencies.svg

deps-graph: deps-graph-frontend deps-graph-backend deps-graph-fullstack
