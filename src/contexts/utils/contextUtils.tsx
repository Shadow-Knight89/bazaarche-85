
import React from 'react';

/**
 * Creates a context with a hook to use it, ensuring proper error handling
 * @param name The name of the context for error messages
 * @returns A tuple with the context and a hook to use it
 */
export function createContextWithHook<T>(name: string) {
  const Context = React.createContext<T | undefined>(undefined);
  Context.displayName = name;
  
  const useContext = () => {
    const context = React.useContext(Context);
    if (context === undefined) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }
    return context;
  };
  
  return [Context, useContext] as const;
}

/**
 * Higher-order component that combines multiple providers
 * @param providers Array of provider components with their props
 * @returns A component that wraps children with all providers
 */
export function combineProviders(providers: Array<[React.ComponentType<any>, Record<string, any>]>) {
  return ({ children }: { children: React.ReactNode }) => {
    return providers.reduceRight(
      (acc, [Provider, props]) => <Provider {...props}>{acc}</Provider>,
      children
    );
  };
}
