FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive
ENV PATH="/tqec/.venv/bin:$PATH"

RUN apt-get update && apt-get install -y \
    pandoc \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install uv directly from the official binary
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /tqec

# Enable bytecode compilation for faster startups
ENV UV_COMPILE_BYTECODE=1

COPY . .
RUN uv python pin 3.12
RUN uv sync --frozen --no-cache --all-groups

# Open shell by default
CMD ["/bin/bash"]
