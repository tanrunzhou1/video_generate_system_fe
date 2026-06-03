export async function getInitialState(): Promise<{ name: string }> {
  return { name: 'AI Video Studio' };
}

export const layout = () => {
  return {
    logo: false,
    menu: {
      locale: false,
    },
    title: 'AI Video Studio',
  };
};
