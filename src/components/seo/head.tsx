type HeadProps = {
  title?: string;
  description?: string;
};

export const Head = ({ title, description }: HeadProps) => {
  return (
    <>
      <title>{title ? title : 'Bulletproof React'}</title>
      <meta
        name="description"
        content={description ? description : 'Welcome to Bulletproof React'}
      />
    </>
  );
};
