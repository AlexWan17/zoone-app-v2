
import React from 'react';
import { cn } from '@/lib/utils';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

export function TypographyH1({ className, as = 'h1', children, ...props }: TypographyProps) {
  const Component = as;
  return (
    <Component 
      className={cn(
        "scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl font-montserrat", 
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyH2({ className, as = 'h2', children, ...props }: TypographyProps) {
  const Component = as;
  return (
    <Component 
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 font-montserrat", 
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyH3({ className, as = 'h3', children, ...props }: TypographyProps) {
  const Component = as;
  return (
    <Component 
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight font-montserrat", 
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyH4({ className, as = 'h4', children, ...props }: TypographyProps) {
  const Component = as;
  return (
    <Component 
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight font-montserrat", 
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyP({ className, as = 'p', children, ...props }: TypographyProps) {
  const Component = as;
  return (
    <Component 
      className={cn(
        "leading-7 [&:not(:first-child)]:mt-6 font-open-sans", 
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyBlockquote({ className, children, ...props }: TypographyProps) {
  return (
    <blockquote 
      className={cn(
        "mt-6 border-l-2 border-primary pl-6 italic font-open-sans", 
        className
      )} 
      {...props}
    >
      {children}
    </blockquote>
  );
}

export function TypographyLead({ className, as = 'p', children, ...props }: TypographyProps) {
  const Component = as;
  return (
    <Component 
      className={cn(
        "text-xl text-muted-foreground font-open-sans", 
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyLarge({ className, as = 'div', children, ...props }: TypographyProps) {
  const Component = as;
  return (
    <Component 
      className={cn(
        "text-lg font-medium font-open-sans", 
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographySmall({ className, as = 'small', children, ...props }: TypographyProps) {
  const Component = as;
  return (
    <Component 
      className={cn(
        "text-sm font-medium leading-none font-open-sans", 
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyMuted({ className, as = 'p', children, ...props }: TypographyProps) {
  const Component = as;
  return (
    <Component 
      className={cn(
        "text-sm text-muted-foreground font-open-sans", 
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyGradient({ className, as = 'span', children, ...props }: TypographyProps) {
  const Component = as;
  return (
    <Component 
      className={cn(
        "bg-blue-violet-gradient text-transparent bg-clip-text font-montserrat", 
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
}
