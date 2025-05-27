"use client";

import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const registerSchema = z.object({
  name: z
    .string({ required_error: "Necessário informar o nome." })
    .trim()
    .min(2, "Necessário informar o nome.")
    .max(50),
  email: z
    .string({ required_error: "Necessário informar o e-mail." })
    .trim()
    .email("E-mail inválido."),
  password: z
    .string({ required_error: "Necessário informar a senha." })
    .trim()
    .min(8, "A senha deve ter pelo menos 8 caracteres."),
  confirmPassword: z
    .string({ required_error: "Necessário confirmar a senha." })
    .trim()
    .min(8, "A confirmação de senha deve ter pelo menos 8 caracteres."),
});

const SignUpForm = () => {
  const formRegister = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmitRegister(values: z.infer<typeof registerSchema>) {
    if(values.confirmPassword !== values.password){
      toast.error("As senhas não coincidem. Por favor, verifique e tente novamente.")
      return
    }

    try {
      await authClient.signUp.email({
        email: values.email,
        password: values.password, 
        name: values.name,
        callbackURL: "/dashboard", 
      },{
        onError: (ctx) => {
          if(ctx.error.code === "USER_ALREADY_EXISTS"){
            toast.error("E-mail já cadastrado.")
            return
          }
          toast.error("Erro ao criar conta.")
        }
      });
    } catch {
      toast.error("Erro ao criar conta.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>Crie uma conta para continuar.</CardDescription>
      </CardHeader>
      <Form {...formRegister}>
        <form
          onSubmit={formRegister.handleSubmit(onSubmitRegister)}
          className="space-y-4"
        >
          <CardContent className="space-y-4">
            <FormField
              control={formRegister.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Informe o nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formRegister.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Informe o email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formRegister.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="Informe a senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formRegister.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="Confirmar a senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={formRegister.formState.isSubmitting}
            >
              {formRegister.formState.isSubmitting ? (
                <Loader2 className="rm-2 h-4 w-4 animate-spin" />
              ) : (
                "Criar conta"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default SignUpForm;
