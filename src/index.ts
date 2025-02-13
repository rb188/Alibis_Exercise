import inquirer from "inquirer";

/* Usado para autocompletar texto, infelizmente com conflitos que não sei resolver

import autocompletePrompt from "inquirer-autocomplete-prompt";
inquirer.registerPrompt("autocomplete", autocompletePrompt);
*/

let startHourTime: Date | null = null;
let endHourTime: Date | null = null;
let crimeDuration: number | null = null;


async function main() {
  const resposta = await inquirer.prompt([
    {
      type: "input",
      name: "startDate",
      message: "Horário Inicial do Crime: ",
      validate: (value: string) => {
        // Verifica o formato
        const isValidFormat = /^\d{2}:\d{2}$/.test(value);
        if (!isValidFormat) {
          return "Digite um horário válido no formato HH:MM.";
        }

        // Separa as horas e minutos da string através do ":" e converte para números
        const [hours, minutes] = value.split(":").map(Number);
        const isValidTime =
          hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;

        if (isValidTime) {
          startHourTime = new Date();
          startHourTime.setHours(hours, minutes, 0, 0);
        }
        return isValidTime || "Digite um horário válido.";
      },
    },
    {
      type: "input",
      name: "endDate",
      message: "Horário Final do Crime: ",
      validate: (value: string) => {
        const isValidFormat = /^\d{2}:\d{2}$/.test(value);
        if (!isValidFormat) {
          return "Digite um horário válido no formato HH:MM.";
        }

        const [hours, minutes] = value.split(":").map(Number);
        const isValidTime =
          hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;

        if (isValidTime) {
          endHourTime = new Date();
          endHourTime.setHours(hours, minutes, 0, 0);

          if (startHourTime && endHourTime <= startHourTime) {
            return "O horário de fim do crime não pode ser menor que o horário de início.";
          }
        }

        return isValidTime || "Digite um horário válido.";
      },
    },
    {
      type: "input",
      name: "crimeDuration",
      message: "Duração do Crime: ",
      validate: (value: number) => {
        const numberValue = value;
        const isValid = numberValue >= 1 && numberValue <= 600;

        if (isValid) {
          crimeDuration = Number(numberValue);
        }

        return isValid || "Digite um valor entre 1 e 600.";
      },
    },
    {
      type: "input",
      name: "numberOfSuspects",
      message: "Número de Suspeitos: ",
      validate: (value: any) => {
        const numberValue = Number(value);
        const isValid = numberValue >= 1 && numberValue <= 400;
        return isValid || "Digite um valor entre 1 e 400.";
      },
    },
  ]);

  const suspectNumber = resposta.numberOfSuspects;
  console.log(suspectNumber);

  await suspectInfo(suspectNumber, []);
  console.log(
    `O horário do crime foi: ${resposta.startDate} ${resposta.endDate} ${resposta.crimeDuration}`
  );
}

main();





async function suspectInfo(suspectNumber: number, suspects: any[] = []) {
  const activityNumber = 0;
  let suspect;
  let startHourTime: number;
  let activities: any[] = [];
  console.log(suspectNumber);

  for (let i = 0; i < suspectNumber; i++) {
    console.log(`<---------------Suspeito ${i + 1}--------------->`);
    suspect = await inquirer.prompt([
      {
        type: "input",
        name: "numberOfActivities",
        message: "Número de atividades do suspeito: ",
      },
    ]);

    suspects.push(suspect);
    console.log(suspects);

    for (let i = 0; i < suspect.numberOfActivities; i++) {
      console.log(`<------------Atividade ${i + 1}------------>`);
      const activity = await inquirer.prompt([
        {
          type: "input",
          name: "startHour",
          message: "Horário de Inicio da Atividade: ",
          validate: (value: string) => {
            const isValidFormat = /^\d{2}:\d{2}$/.test(value);
            if (!isValidFormat) {
              return "Digite um horário válido no formato HH:MM.";
            }
            const [hours, minutes] = value.split(":").map(Number);
            const isValidTime =
              hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;

            if (isValidTime) {
              startHourTime = hours;
            }

            // Verifica se o horário de início da atividade é igual a outro horário de início
            activities.filter((activity) => {
              const [startHours, startMinutes] = activity.startHour
                .split(":")
                .map(Number);
              const [endHours, endMinutes] = activity.endHour.split(":").map(Number);

              if (hours >= startHours && hours <= endHours) {
                return "O horário de início da atividade não pode ser igual a outro horário de início.";
              }
            });

            return isValidTime || "Digite um horário válido.";
          },
        },
        {
          type: "input",
          name: "endHour",
          message: "Horário de Fim da Atividade: ",
          validate: (value: string) => {
            const isValidFormat = /^\d{2}:\d{2}$/.test(value);
            if (!isValidFormat) {
              return "Digite um horário válido no formato HH:MM.";
            }
            const [hours, minutes] = value.split(":").map(Number);

            if (hours < startHourTime) {
              return "O horário de fim da atividade não pode ser menor que o horário de início.";
            }

            const isValidTime =
              hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
            return isValidTime || "Digite um horário válido.";
          },
        },
        {
          type: "input",
          name: "activityDistance",
          message: "Distância da Atividade ao local do crime (em minutos): ",
          validate: (value: number) => {
            const isValid = value >= 1 && value < 720;
            return isValid || "Digite um valor entre 1 e 720.";
          },
        },
      ]);

      console.log(activity);
      activities.push(activity);
    }

    const determine = determineAlibi(activities);
    console.log(determine);
    console.log("<---------------------------------------->");
  }

  return suspects;
}





async function determineAlibi(activities: any[]) {
  console.log(startHourTime, endHourTime, crimeDuration);
    for (const activity of activities) {
      const startActivity = new Date();
      const [startHours, startMinutes] = activity.startHour
        .split(":")
        .map(Number);
      startActivity.setHours(startHours, startMinutes, 0, 0);

      console.log("startActivity:", startActivity);

      const endActivity = new Date();
      const [endHours, endMinutes] = activity.endHour.split(":").map(Number);
      endActivity.setHours(endHours, endMinutes, 0, 0);

      const activityDistance: number = Number(activity.activityDistance);

      if (startHourTime && endHourTime && crimeDuration) {
        const addMinutesToEndActivity = new Date(
          endActivity.getTime() + activityDistance * 60000
        );

        const addCrimeMinutesToEndActivity = new Date(
          addMinutesToEndActivity.getTime() + crimeDuration * 60000
        );

        const possibleCrimeStartTime = new Date(startActivity);
        possibleCrimeStartTime.setMinutes(
          possibleCrimeStartTime.getMinutes() -
            (crimeDuration + activityDistance)
        );

        console.log(possibleCrimeStartTime); 
        console.log(possibleCrimeStartTime.getMinutes()); 

        
        const crimeCouldHappenBeforeActivity = possibleCrimeStartTime >= startHourTime;
        const crimeCouldHappenAfterActivity = addCrimeMinutesToEndActivity <= endHourTime;

        if (!crimeCouldHappenBeforeActivity && !crimeCouldHappenAfterActivity) {
          console.log(
            "O suspeito tem álibi (crime não coube em nenhum intervalo)."
          );
          
          return "O suspeito tem álibi.";
        }

        console.log("O suspeito não tem álibi.");
        return "O suspeito não tem álibi.";
      }
    }
}
    
