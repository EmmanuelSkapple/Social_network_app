// eslint-disable-next-line consistent-return
export const login = async (phone: string) => {
  try {
    const res = await fetch(
      `https://lyfelab.org/login?${
        new URLSearchParams({
          phonenumber: `+${phone}`,
          channel: 'sms',
        })}`,
    );
    return res;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

// eslint-disable-next-line consistent-return
export const verify = async (phone: string, code: string) => {
  try {
    const res = await fetch(
      `https://lyfelab.org/verify?${
        new URLSearchParams({
          phonenumber: `+${phone}`,
          code,
        })}`,
    );
    // eslint-disable-next-line no-console
    console.log(res);
    return res;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
