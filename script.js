// Переменные для подсчета итераций
let relaxationCount;
let simpleIterationCount;

// Переменная для хранения канонической матрицы A
let canonicalMatrixA;

// Функции для проверки условия сходимости алгоритмов

// Получение канонической формы матрицы A для проверки условия сходимости
const getCanonicalMatrixA = (matrix) => {
  let canonicalMatrixA = [],
    rows = matrix.length,
    cols = matrix[0].length;

  for (let i = 0; i < rows; i++) {
    canonicalMatrixA.push([]);

    for (let j = 0; j < cols; j++) {
      if (i !== j) canonicalMatrixA[i].push(-1 * (matrix[i][j] / matrix[i][i]));
    }
  }

  return canonicalMatrixA;
};

// Подсчет M нормы матрицы (max сумма модулей по строке)
const calculateMNorm = (matrix) => {
  let stringSum,
    mNorm = 0,
    rows = matrix.length,
    cols = matrix[0].length;

  for (let i = 0; i < rows; i++) {
    stringSum = 0;

    for (let j = 0; j < cols; j++) {
      stringSum += Math.abs(matrix[i][j]);
    }

    if (stringSum > mNorm) {
      mNorm = stringSum;
    }
  }

  return mNorm;
};

// Подсчет L нормы матрицы (max сумма модулей по столбцу)
const calculateLNorm = (matrix) => {
  let columnSum,
    lNorm = 0,
    rows = matrix.length,
    cols = matrix[0].length;

  for (let i = 0; i < cols; i++) {
    columnSum = 0;

    for (let j = 0; j < rows; j++) {
      columnSum += Math.abs(matrix[j][i]);
    }
    if (columnSum > lNorm) {
      lNorm = columnSum;
    }
  }

  return lNorm;
};

// Подсчет K нормы матрицы (корень из суммы квадратов всех элементов матрицы)
const calculateKNorm = (matrix) => {
  let sumOfSquaresOfElements = 0,
    kNorm,
    rows = matrix.length,
    cols = matrix[0].length;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      sumOfSquaresOfElements += Math.pow(matrix[i][j], 2);
    }
  }

  kNorm = Math.sqrt(sumOfSquaresOfElements);

  return kNorm;
};

// Вызов функции подсчета всех трех норм
const calculateMatrixNorms = (matrix) => {
  let matrixNorms = [
    calculateMNorm(matrix),
    calculateLNorm(matrix),
    calculateKNorm(matrix),
  ];

  // возвращение только тех норм, которые меньше 1
  return matrixNorms.filter((matrixNorm) => matrixNorm < 1);
};

// Функция проверки условия сходимости
const checkMethodConvergence = (matrix) => {
  canonicalMatrixA = getCanonicalMatrixA(matrix);

  let validNorms = calculateMatrixNorms(canonicalMatrixA);

  if (validNorms.length > 0) {
    return true;
  }

  return false;
};

// Получение вида матрицы для метода релаксаций
const getRelaxationMatrixForm = (matrix, vector) => {
  let rows = matrix.length;
  let cols = rows + 1;
  let newMatrixForm = [];

  for (let i = 0; i < rows; i++) {
    newMatrixForm.push([]);

    for (let j = 0; j < cols; j++) {
      if (j !== cols - 1)
        newMatrixForm[i].push(matrix[i][j] / (-1 * matrix[i][i]));
      else newMatrixForm[i].push((-1 * vector[i]) / (-1 * matrix[i][i]));
    }
  }

  console.log(
    "Вид матрицы для метода релаксаций (коэффициенты столбца свободных членов в начале)"
  );
  console.log(newMatrixForm);

  return newMatrixForm;
};

// Метод релаксаций
const relaxationMethod = (matrix, eps) => {
  let rows = matrix.length;
  let cols = matrix[0].length;
  let xVector = [0, 0, 0]; // вектор начальных приближений
  let maxDiscrepancy, indexOfDiscrepancy; // максимальная невязка и ее номер
  let changeDiscrepancy; // величина, на которую будет меняться вектор начальных приближений
  relaxationCount = 0;

  do {
    maxDiscrepancy = 0;
    indexOfDiscrepancy = 0;

    for (let i = 0; i < rows; i++) {
      let currentDiscrepancy = 0;

      // считаем текущую невязку
      for (let j = 0; j < cols; j++) {
        if (j !== cols - 1) currentDiscrepancy += matrix[i][j] * xVector[j];
        else currentDiscrepancy += matrix[i][j];
      }

      console.log(`R${i + 1} = `, currentDiscrepancy);

      // находим максимальную по модулю невязку
      if (Math.abs(currentDiscrepancy) > maxDiscrepancy) {
        maxDiscrepancy = Math.abs(currentDiscrepancy);
        changeDiscrepancy = currentDiscrepancy;
        indexOfDiscrepancy = i;
      }
    }

    console.log("next step");

    // меняем значение соответствующей компоненты вектора начального приближения
    xVector[indexOfDiscrepancy] += changeDiscrepancy;
    relaxationCount += 1;
  } while (maxDiscrepancy > eps);

  return xVector;
};

// Получение вида матрицы для метода простой итерации
const getSimpleIterationMatrixForm = (matrix, vector) => {
  let rows = matrix.length;
  let cols = rows;
  let newMatrixForm = [];

  for (let i = 0; i < rows; i++) {
    newMatrixForm.push([]);

    for (let j = 0; j < cols; j++) {
      if (j !== i) newMatrixForm[i].push(matrix[i][j] / (-1 * matrix[i][i]));
      else newMatrixForm[i].push((-1 * vector[i]) / (-1 * matrix[i][i]));
    }
  }

  return newMatrixForm;
};

// Условие отстановки алгоритма для метода простой итерации
const stopCondition = () => {
  let a = Math.max(...calculateMatrixNorms(canonicalMatrixA));
  return a / (1 - a);
};

// Метод простой итерации
const simpleIterationMethod = (matrix, eps) => {
  let xVector = [0, 0, 0]; // вектор начальных приближений
  let rows = matrix.length;
  let cols = rows;
  simpleIterationCount = 0;
  let condition = true;

  while (condition) {
    let xn = [];

    for (let i = 0; i < rows; i++) {
      xn[i] = matrix[i][i];

      for (let j = 0; j < cols; j++) {
        if (i === j) {
          continue;
        } else {
          xn[i] += matrix[i][j] * xVector[j];
        }
      }
    }

    for (let i = 0; i < rows; i++) {
      if (Math.abs(xn[i] - xVector[i]) * stopCondition() < eps) {
        condition = false;
        break;
      }
    }

    for (let i = 0; i < rows; i++) {
      xVector[i] = xn[i];
    }

    simpleIterationCount += 1;
  }

  return xVector;
};

// Программная проверка правильности найденного решения
const checkSolution = (matrix, vector, solution) => {
  let rows = matrix.length;
  let cols = matrix[0].length;

  for (let i = 0; i < rows; i++) {
    let check = 0;

    for (let j = 0; j < cols; j++) {
      check += matrix[i][j] * solution[j];
    }

    check -= vector[i];
    check = Number(check.toFixed(0));

    if (check !== 0) {
      return false;
    }
  }

  return true;
};

// Функция для выведения решения в виде строки
const putSolutionIntoString = (solution) => {
  let result = "";

  for (let i = 0; i < solution.length; i++) {
    result += `x${i + 1} = ${solution[i].toFixed(4)} </br>`;
  }

  return result;
};

// !Основная функция
const solveSystemOfEquations = () => {
  if (document.querySelector(".equation__solution table"))
    document.querySelector(".equation__solution table").remove();
  const rows = document.querySelectorAll(".equation-box__row");
  let matrix = [];
  let vector = [];

  // заполнение матрицы и вектора свободных членов значениями из формы
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const inputValues = row.querySelectorAll(".equation-box__input.value");
    matrix.push([]);

    for (let j = 0; j < inputValues.length; j++) {
      const inputValue = inputValues[j].value;
      matrix[i].push(Number(inputValue));
    }

    const inputAnswer = row.querySelector(".equation-box__input.answer").value;
    vector.push(Number(inputAnswer));
  }

  // проверка условия сходимости (подходит и для метода релаксаций и метода простой итерации)
  if (checkMethodConvergence(matrix)) {
    let eps = 0.1;
    let table = document.createElement("table");
    table.insertAdjacentHTML(
      "afterbegin",
      "<tr><th>Точность</th><th>Решение по методу релаксации</th><th>Итерации</th><th>Решение по методу простой итерации</th><th>Итерации</th></tr> "
    );

    // получаем формы матриц для метода релаксаций и метода простых итераций
    let relaxationMatrixForm = getRelaxationMatrixForm(matrix, vector);
    let simpleIterationMatrixForm = getSimpleIterationMatrixForm(
      matrix,
      vector
    );

    // вычисляем решения и выводим в таблицу
    for (let i = 0; i < 6; i++) {
      // Получаем решение по методу релаксаций
      let relaxationSolution = relaxationMethod(relaxationMatrixForm, eps);
      // Получаем решение по методу простой итерации
      let simpleIterationSolution = simpleIterationMethod(
        simpleIterationMatrixForm,
        eps
      );

      // Проверяем правильность найденного решения, если оно правильное, выводим результат
      if (
        checkSolution(matrix, vector, relaxationSolution) &&
        checkSolution(matrix, vector, simpleIterationSolution)
      ) {
        table.insertAdjacentHTML(
          "beforeend",
          `<tr><td>${eps.toFixed(6)}</td>
				<td>${putSolutionIntoString(relaxationSolution)}</td>
				<td>${relaxationCount}</td>
				<td>${putSolutionIntoString(simpleIterationSolution)}</td>
				<td>${simpleIterationCount}</td></tr>`
        );
      }

      eps *= 0.1;
    }

    document.querySelector(".equation__solution").prepend(table);
  } else {
    alert("Метод не сходится. Введите другое уравнение");
  }
};

// вызов функции решения системы при клике на кнопку
document
  .querySelector(".equation-box__check")
  .addEventListener("click", function (e) {
    solveSystemOfEquations();
  });