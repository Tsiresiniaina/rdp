export function validateCore(core) {
  let errors = [];
  //PRESENCE DES CHAMPS
  if (!core.places) {
    errors.push(`Places : le champ places est manquant`);
  }
  if (!core.transitions) {
    errors.push(`Transitions : le champ transitions est manquant`);
  }
  if (!core.matricePre) {
    errors.push(`Matrice Pre : le champ matrice pre est manquant`);
  }
  if (!core.matricePost) {
    errors.push(`Matrice Post : le champ matrice post est manquant`);
  }
  if (!core.marquageInitial) {
    errors.push(`Marquage Initial : le champ marquage initial est manquant`);
  }
  //SI CE SONT DES TABLEAUX
  if (!Array.isArray(core.places)) {
    errors.push(`Places : les places n'est pas un tableau`);
  }
  if (!Array.isArray(core.transitions)) {
    errors.push(`Transitions : les transitions n'est pas un tableau`);
  }
  if (!Array.isArray(core.matricePre)) {
    errors.push(`Matrice Pre : la matrice pre n'est pas un tableau`);
  }
  if (!Array.isArray(core.matricePost)) {
    errors.push(`Matrice Post : la matrice post n'est pas un tableau`);
  }
  if (!Array.isArray(core.marquageInitial)) {
    errors.push(`Marquage Initial : le marquage initial n'est pas un tableau`);
  }
  //VERIFICATION DES DIMENSIONS
  if (core.matricePre.length !== core.places.length) {
    errors.push(
      `Matrice Pre : le nombre de lignes de la matrice pre n'est pas égal au nombre de places`,
    );
  }
  if (core.matricePost.length !== core.places.length) {
    errors.push(
      `Matrice Post : le nombre de lignes de la matrice post n'est pas égal au nombre de places`,
    );
  }
  if (core.marquageInitial.length !== core.places.length) {
    errors.push(
      `Marquage Initial : le nombre d'éléments du marquage initial n'est pas égal au nombre de places`,
    );
  }
   for(let i = 0;i < core.matricePre.length; i++) {
    if (core.matricePre[i].length !== core.transitions.length) {
        errors.push(`Matrice Pre P${i} : le nombre de colonnes de la matrice pre n'est pas égal au nombre de transitions`);
    }
  }
  for(let i = 0;i < core.matricePost.length; i++) {
    if (core.matricePost[i].length !== core.transitions.length) {
        errors.push(`Matrice Post P${i} : le nombre de colonnes de la matrice post n'est pas égal au nombre de transitions`);
    }
  }
  //VERFICATION DES VALEURS
  for(let i = 0;i < core.matricePre.length; i++) {
    for(let j = 0;j < core.matricePre[i].length; j++) {
        if (core.matricePre[i][j] < 0 ||  !Number.isInteger(core.matricePre[i][j])) {
            errors.push(`Matrice Pre P${i+1} T${j+1} : la valeur de la matrice pre n'est un entier ou negatif`);
        }
    }
    }
    for(let i = 0;i < core.matricePost.length; i++) {
        for(let j = 0;j < core.matricePost[i].length; j++) {
            if (core.matricePost[i][j] < 0 ||  !Number.isInteger(core.matricePost[i][j])) {
                errors.push(`Matrice Post P${i+1} T${j+1} : la valeur de la matrice post n'est un entier ou negatif`);
            }
        }
    }
  return errors;
}
