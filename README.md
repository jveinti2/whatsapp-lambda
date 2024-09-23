# WhatsApp Lambda Node.js

## Instrucciones

1. **Clonar el repositorio**

   - Usa el siguiente comando para clonar el repositorio:
     ```bash
     git clone <url-del-repositorio>
     ```

2. **Instalar dependencias**

   - Ejecuta el siguiente comando para instalar las dependencias necesarias:
     ```bash
     npm install
     ```

3. **Configurar Twilio**

   - Reemplaza la información de las claves de Twilio en el archivo de configuración.

4. **Configuración de AWS**
   - No es necesario proporcionar las claves de AWS, ya que la ejecución se realiza en AWS Lambda.
   - Asegúrate de configurar la función Lambda con un rol que tenga **acceso completo a DynamoDB**.
   - También necesitarás **crear la tabla en DynamoDB** según sea necesario.

## Notas Adicionales

- Verifica que la configuración de tu entorno en AWS esté correcta antes de ejecutar la Lambda.
- Consulta la documentación de Twilio y AWS para asegurarte de que estás utilizando las configuraciones adecuadas.
