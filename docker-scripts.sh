#!/bin/bash

# Scripts para desarrollo con Docker + Capacitor + Android

echo "🐳 Diabetes Control - Docker + Capacitor + Android"
echo "=================================================="

case $1 in
  "dev")
    echo "🚀 Iniciando servidor de desarrollo..."
    docker-compose up --build diabetes-app
    ;;
  "build-apk")
    echo "📱 Construyendo APK de Android..."
    docker-compose --profile build up --build android-builder
    ;;
  "shell")
    echo "🐚 Abriendo shell en el contenedor..."
    docker-compose run --rm diabetes-app bash
    ;;
  "clean")
    echo "🧹 Limpiando contenedores y volúmenes..."
    docker-compose down -v
    docker system prune -f
    ;;
  "logs")
    echo "📋 Mostrando logs..."
    docker-compose logs -f diabetes-app
    ;;
  "sync")
    echo "🔄 Sincronizando código con Capacitor..."
    docker-compose run --rm diabetes-app npx cap sync android
    ;;
  *)
    echo "Comandos disponibles:"
    echo "  ./docker-scripts.sh dev        - Iniciar desarrollo"
    echo "  ./docker-scripts.sh build-apk  - Construir APK"
    echo "  ./docker-scripts.sh shell      - Abrir terminal"
    echo "  ./docker-scripts.sh clean      - Limpiar contenedores"
    echo "  ./docker-scripts.sh logs       - Ver logs"
    echo "  ./docker-scripts.sh sync       - Sincronizar con Android"
    ;;
esac
