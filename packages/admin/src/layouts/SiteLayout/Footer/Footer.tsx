import { VFC } from 'react';

const Footer: VFC = () => {
  return (
    <footer className="w-full py-4">
      <div className="container mx-auto">
        <span>prom cms {import.meta.env.DEV ? '@ development' : ''}</span>
      </div>
    </footer>
  );
};

export default Footer;
