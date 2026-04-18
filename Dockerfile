FROM astral/uv:python3.12-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# RUN python -m venv /opt/tqec_venv
# ENV PATH="/opt/tqec_venv/bin:$PATH"

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
# RUN uv pin python 3.12
RUN uv sync --all-groups

# Open shell by default
CMD ["/bin/bash"]
