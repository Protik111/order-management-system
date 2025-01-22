FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Install PostgreSQL client (optional for `pg_isready`)
RUN apt-get update && apt-get install -y postgresql-client

# Copy package.json and package-lock.json
COPY package*.json ./

# Ensure NODE_ENV is set to development for `devDependencies`
ENV NODE_ENV=development

# Install dependencies (including devDependencies)
RUN npm install

# Rebuild native modules for Docker architecture (e.g., bcrypt)
RUN npm rebuild bcrypt --build-from-source

COPY prisma ./prisma

# Generate Prisma client (ensures it matches the schema)
RUN npx prisma generate

# Copy application files
COPY . .


# Expose the application port
EXPOSE 5000

# Copy the startup script and make it executable
COPY startup.sh .
RUN chmod +x startup.sh

# Run the startup script
CMD ["./startup.sh"]
