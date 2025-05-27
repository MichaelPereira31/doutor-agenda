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
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z
    .string({ required_error: "Necessário informar o e-mail." })
    .trim()
    .email("E-mail inválido."),
  password: z
    .string({ required_error: "Necessário informar a senha." })
    .trim()
    .min(8, "A senha deve ter pelo menos 8 caracteres."),
});

const LoginForm = () => {
  const router = useRouter()
  const formlogin = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmitlogin(values: z.infer<typeof loginSchema>) {
    await authClient.signIn.email({
      email: values.email,
      password: values.password
    }, {
      onSuccess: () => {
        router.push("/dashboard")
      },
      onError: () => {
        toast.error("E-mail ou senha inválidos. Tente novamente.")
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Faça login para entrar.</CardDescription>
      </CardHeader>
      <Form {...formlogin}>
        <form
          onSubmit={formlogin.handleSubmit(onSubmitlogin)}
          className="space-y-4"
        >
          <CardContent className="space-y-4">
            <FormField
              control={formlogin.control}
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
              control={formlogin.control}
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
            
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
            <Button
              type="submit"
              className="w-full"
              disabled={formlogin.formState.isSubmitting}
            >
              {formlogin.formState.isSubmitting ? (
                <Loader2 className="rm-2 h-4 w-4 animate-spin" />
              ) : (
                "Criar conta"
              )}
            </Button>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LoginForm;
