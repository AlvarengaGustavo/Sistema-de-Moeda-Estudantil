export const interpolateWithValues = (
  strMakeChanges: string,
  ...values: string[]
) => {
  values.forEach((value) => {
    const matches = strMakeChanges.match(/{[A-Za-z]+}/g);
    if (matches) {
      strMakeChanges = strMakeChanges.replace(matches[0], value);
    }
  });
  return strMakeChanges;
};

export const isValidCpf = (cpfInput: string): boolean => {
  const cpf = cpfInput.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i), 10) * (10 - i);
  }
  let firstCheck = (sum * 10) % 11;
  if (firstCheck === 10) firstCheck = 0;
  if (firstCheck !== parseInt(cpf.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i), 10) * (11 - i);
  }
  let secondCheck = (sum * 10) % 11;
  if (secondCheck === 10) secondCheck = 0;
  if (secondCheck !== parseInt(cpf.charAt(10), 10)) return false;

  return true;
};

export const isValidCnpj = (cnpj: string): boolean => {
  if (!cnpj) return false;

  const cleaned = cnpj.replace(/\D/g, "");

  if (cleaned.length !== 14) return false;

  if (/^(\d)\1{13}$/.test(cleaned)) return false;

  const calcCheckDigit = (cnpjNumbers: string, length: number) => {
    const weights =
      length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const sum = cnpjNumbers
      .split("")
      .slice(0, length)
      .reduce((acc, num, idx) => acc + Number(num) * weights[idx], 0);

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstCheckDigit = calcCheckDigit(cleaned, 12);
  const secondCheckDigit = calcCheckDigit(cleaned, 13);

  return (
    firstCheckDigit === Number(cleaned[12]) &&
    secondCheckDigit === Number(cleaned[13])
  );
};

export const isValidEmail = (email: string): boolean => {
  const trimmed = email.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(trimmed);
};

export const formatCpf = (digits: string) => {
  const d = digits.padEnd(11, "");
  const p1 = d.slice(0, 3);
  const p2 = d.slice(3, 6);
  const p3 = d.slice(6, 9);
  const p4 = d.slice(9, 11);
  if (digits.length <= 3) return p1;
  if (digits.length <= 6) return `${p1}.${p2}`;
  if (digits.length <= 9) return `${p1}.${p2}.${p3}`;
  return `${p1}.${p2}.${p3}-${p4}`;
};

export const formatCnpj = (digits: string) => {
  const d = digits.padEnd(14, "");
  const p1 = d.slice(0, 2);
  const p2 = d.slice(2, 5);
  const p3 = d.slice(5, 8);
  const p4 = d.slice(8, 12);
  const p5 = d.slice(12, 14);
  if (digits.length <= 2) return p1;
  if (digits.length <= 5) return `${p1}.${p2}`;
  if (digits.length <= 8) return `${p1}.${p2}.${p3}`;
  if (digits.length <= 12) return `${p1}.${p2}.${p3}/${p4}`;
  return `${p1}.${p2}.${p3}/${p4}-${p5}`;
};
