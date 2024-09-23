const AWS = require("aws-sdk");
const DynamoDB = new AWS.DynamoDB.DocumentClient();
const twilio = require("twilio");

// Datos de Twilio
const accountSid = "***;"; // Reemplazar con datos de Twilio
const authToken = "***"; // Reemplazar con datos de Twilio
const client = twilio(accountSid, authToken);

exports.handler = async (event) => {
  try {
    // Leer datos desde DynamoDB
    const params = {
      TableName: "Tareas",
      KeyConditionExpression: "tipo = :tipo",
      ExpressionAttributeValues: {
        ":tipo": "aseo",
      },
    };

    const dataDynamoDB = await DynamoDB.query(params).promise();

    // Extraer el responsable de aseo
    const responsables = dataDynamoDB.Items;
    const responsableAseo = responsables.find(
      (participante) => participante.responsable
    );

    if (!responsableAseo) {
      throw new Error("No hay responsable asignado para aseo.");
    }

    const messageBody = `Hola! 👋 te recuerdo las responsabilidades para esta semana \n 🧹Aseo: ${responsableAseo.nombre}`;

    const phoneNumbers = [
      "whatsapp:+57******", //Reemplazar con los números de teléfono de los participantes
      "whatsapp:+57******", //Reemplazar con los números de teléfono de los participantes
      "whatsapp:+57******", //Reemplazar con los números de teléfono de los participantes
      "whatsapp:+57******", //Reemplazar con los números de teléfono de los participantes
    ];

    // Enviar mensajes
    const promises = phoneNumbers.map((number) => {
      return client.messages.create({
        from: "whatsapp:+1******", // Reemplazar con el número de Twilio
        to: number,
        body: messageBody,
      });
    });

    await Promise.all(promises);

    // Modificar el responsable en DynamoDB
    const validationTurns = async () => {
      const day = new Date().getDay();
      if (day !== 0) {
        // Si no es domingo
        const moverResponsable = () => {
          const responsableIndex = responsables.findIndex(
            (participante) => participante.responsable
          );

          responsables[responsableIndex].responsable = false;

          const siguienteIndex = (responsableIndex + 1) % responsables.length;

          responsables[siguienteIndex].responsable = true;

          return responsables[siguienteIndex].nombre;
        };

        const nuevoResponsableAseo = moverResponsable();

        // Actualizar la tabla en DynamoDB
        const updatePromises = responsables.map((participante) => {
          const paramsUpdate = {
            TableName: "Tareas",
            Item: {
              tipo: "aseo",
              nombre: participante.nombre,
              responsable: participante.responsable,
            },
          };
          return DynamoDB.put(paramsUpdate).promise();
        });

        await Promise.all(updatePromises);

        console.log(`El nuevo responsable de aseo es: ${nuevoResponsableAseo}`);
      } else {
        console.log("Hoy no es domingo, no se necesitan cambios.");
      }
    };

    await validationTurns();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Mensajes enviados correctamente",
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};
