// src/components/mdx-content.tsx
import * as runtime from "react/jsx-runtime";
import type React from "react";

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default as React.ComponentType<{
    components?: Record<string, React.ComponentType>;
  }>;
};

type MDXProps = {
  code: string;
  components?: Record<string, React.ComponentType>;
};

export function MDXContent({ code, components }: MDXProps) {
  const Component = useMDXComponent(code);
  // eslint-disable-next-line react-hooks/static-components
  return <Component components={components} />;
}
