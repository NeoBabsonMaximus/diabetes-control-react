# Dockerfile para desarrollo React + Capacitor + Android
FROM node:18-bullseye

# Instalar dependencias del sistema para Android
RUN apt-get update && apt-get install -y \
    openjdk-11-jdk \
    wget \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Configurar JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64

# Instalar Android SDK
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools

RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
    unzip commandlinetools-linux-9477386_latest.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm commandlinetools-linux-9477386_latest.zip

# Aceptar licencias de Android SDK
RUN yes | sdkmanager --licenses

# Instalar componentes necesarios de Android SDK
RUN sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

# Instalar Gradle
ENV GRADLE_VERSION=7.6
RUN wget -q https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip && \
    unzip gradle-${GRADLE_VERSION}-bin.zip -d /opt && \
    ln -s /opt/gradle-${GRADLE_VERSION}/bin/gradle /usr/local/bin/gradle && \
    rm gradle-${GRADLE_VERSION}-bin.zip

# Configurar directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias de Node.js
RUN npm install

# Exponer puertos
EXPOSE 3000 8100

# Comando por defecto
CMD ["npm", "start"]
