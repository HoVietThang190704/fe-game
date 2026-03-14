"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import Image from "next/image";

type AuthCardProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-0 bg-gradient-to-br from-card to-card/80/10">
        <CardHeader className="items-center text-center pt-8">
          <Image
            src="/images/iconLogo.png"
            alt="logo"
            className="mx-auto mb-2 h-12 w-12 rounded-full object-cover"
            width={48}
            height={48}
          />
          <CardTitle className="text-2xl">{title}</CardTitle>
          {description && (
            <CardDescription className="mt-1">{description}</CardDescription>
          )}
        </CardHeader>

        <CardContent className="px-8 pb-8 pt-2">{children}</CardContent>
      </Card>
    </div>
  );
}

export default AuthCard;
