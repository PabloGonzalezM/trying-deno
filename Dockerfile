FROM hayd/alpine-deno:1.0.1

EXPOSE 1993

WORKDIR /app

USER deno

# COPY deps.ts .
# RUN deno cache deps.ts

COPY . .
RUN deno cache app/server.ts

CMD ["run", "--allow-net", "app/server.ts"]