"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, UserPlus, CheckCircle, ArrowLeft, ArrowRight, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/_lib/auth-provider";

import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";

// Schemas por step
const step1Schema = z.object({
  email: z.string().email("Digite um email válido").min(1, "Email é obrigatório"),
  phone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .regex(/^[\d\s()+\-]+$/, "Digite apenas números e símbolos de telefone")
    .min(1, "Telefone é obrigatório"),
});

const step2Schema = z.object({
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .regex(/[A-Za-z]/, "Senha deve conter pelo menos uma letra")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  confirmPassword: z.string().min(1, "Confirme sua senha"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const step3Schema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").min(1, "Nome é obrigatório"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres").min(1, "Sobrenome é obrigatório"),
});

// Schema completo
const registerSchema = z.object({
  email: z.string().email("Digite um email válido").min(1, "Email é obrigatório"),
  phone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .regex(/^[\d\s()+\-]+$/, "Digite apenas números e símbolos de telefone")
    .min(1, "Telefone é obrigatório"),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .regex(/[A-Za-z]/, "Senha deve conter pelo menos uma letra")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
  confirmPassword: z.string().min(1, "Confirme sua senha"),
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").min(1, "Nome é obrigatório"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres").min(1, "Sobrenome é obrigatório"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const { login } = useAuth();

  const form = useForm<RegisterFormData>({
    // Só valida quando submete - SEM validação automática
    mode: "onSubmit",
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  // Limpar erros quando mudar de step (exceto quando volta por erro de duplicata)
  useEffect(() => {
    // Só limpa erros se não acabou de voltar para Step 1 por erro de duplicata
    const timer = setTimeout(() => {
      // Não limpar se há erros manuais (como email duplicado)
      const hasManualErrors = Object.values(form.formState.errors).some(
        error => error?.type === 'manual'
      );
      if (!hasManualErrors) {
        form.clearErrors();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentStep, form]);

  const nextStep = () => {
    let isValid = true;
    
    // Só valida o step ATUAL quando tenta avançar
    // NÃO valida o próximo step que ainda nem foi preenchido
    if (currentStep === 1) {
      try {
        const values = {
          email: form.getValues('email'),
          phone: form.getValues('phone')
        };
        step1Schema.parse(values);
        form.clearErrors(['email', 'phone']);
      } catch (error: any) {
        isValid = false;
        if (error.errors) {
          error.errors.forEach((err: any) => {
            form.setError(err.path[0] as any, { message: err.message });
          });
        }
      }
    } else if (currentStep === 2) {
      try {
        const values = {
          password: form.getValues('password'),
          confirmPassword: form.getValues('confirmPassword')
        };
        step2Schema.parse(values);
        form.clearErrors(['password', 'confirmPassword']);
      } catch (error: any) {
        isValid = false;
        if (error.errors) {
          error.errors.forEach((err: any) => {
            form.setError(err.path[0] as any, { message: err.message });
          });
        }
      }
    }
    // Step 3 não precisa de validação no nextStep porque é o último
    
    if (isValid && currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    // Limpar erros ao voltar de step
    form.clearErrors();
    setCurrentStep(prev => prev - 1);
  };

  const getStepInfo = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Vamos começar!",
          description: "Digite seu email e telefone para contato",
          icon: <Mail className="w-8 h-8 text-primary" />
        };
      case 2:
        return {
          title: "Crie sua senha",
          description: "Escolha uma senha segura para sua conta",
          icon: <Lock className="w-8 h-8 text-primary" />
        };
      case 3:
        return {
          title: "Quase pronto!",
          description: "Como podemos te chamar?",
          icon: <User className="w-8 h-8 text-primary" />
        };
      default:
        return {
          title: "Cadastro",
          description: "Crie sua conta",
          icon: <UserPlus className="w-8 h-8 text-primary" />
        };
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    // Validação manual com Zod - só valida quando clica "Criar conta"
    try {
      registerSchema.parse(data);
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = error.errors.map((err: any) => err.message);
        toast.error(`Por favor, corrija: ${errorMessages.join(', ')}`, {
          duration: 4000
        });
      }
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Tratar erros específicos do backend
        if (result.error.includes("email já está cadastrado")) {
          // Voltar para Step 1, mostrar erro visual no campo email e toast
          console.log("🔴 Valores antes de voltar:", form.getValues());
          setCurrentStep(1);
          console.log("🔴 Antes de setError - errors:", form.formState.errors);
          
          // Focar no campo email que tem erro
          setTimeout(() => {
            form.setError("email", { 
              type: "manual", 
              message: "Este email já existe" 
            });
          }, 50);
          
          console.log("🔴 Depois de setError - errors:", form.formState.errors);
          toast.error("Este email já possui uma conta. Tente fazer login ou use outro email.", {
            duration: 5000
          });
        } else if (result.error.includes("telefone já está cadastrado")) {
          // Voltar para Step 1, mostrar erro visual no campo telefone e toast  
          setCurrentStep(1);
          form.setError("phone", { 
            type: "manual", 
            message: "Este telefone já está cadastrado" 
          });
          toast.error("Este telefone já está cadastrado. Use outro número.", {
            duration: 5000
          });
        } else {
          toast.error(result.error || 'Erro no cadastro', {
            duration: 4000
          });
        }
        return;
      }

      // Sucesso - usar contexto personalizado
      if (result.token) {
        login(result.token, result.user);
      }

      setIsSuccess(true);
      toast.success("Conta criada com sucesso!", {
        description: "Redirecionando para a página inicial...",
        duration: 3000
      });

      // Redirecionar após 2 segundos para página de origem ou home
      setTimeout(() => {
        router.push(returnUrl || '/');
      }, 2000);

    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error(error instanceof Error ? error.message : "Erro no cadastro", {
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stepInfo = getStepInfo();

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              console.log("🔴 Renderizando email - erro:", form.formState.errors.email);
              const hasError = !!form.formState.errors.email;
              console.log("🔴 hasError:", hasError);
              
              return (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="seu@email.com" 
                      type="email"
                      className={hasError ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500" : ""}
                      {...field}
                      value={form.getValues('email') || field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      // Limpar erro quando usuário começar a digitar
                      if (form.formState.errors.email) {
                        form.clearErrors("email");
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => {
              console.log("📱 Campo phone - field.value:", field.value);
              console.log("📱 Campo phone - form.getValues('phone'):", form.getValues('phone'));
              return (
                <FormItem>
                  <FormLabel>WhatsApp / Telefone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(11) 99999-9999" 
                      type="tel"
                      className={form.formState.errors.phone ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500" : ""}
                      {...field}
                      value={form.getValues('phone') || field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      // Limpar erro quando usuário começar a digitar
                      if (form.formState.errors.phone) {
                        form.clearErrors("phone");
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              );
            }}
          />
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="Mínimo 6 caracteres"
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="Digite a senha novamente"
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="João" 
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Silva" 
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              {stepInfo.icon}
            </div>
            
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step <= currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <CardTitle className="text-2xl font-bold">{stepInfo.title}</CardTitle>
            <CardDescription>
              {stepInfo.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderStep()}

                <div className="flex justify-between gap-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="w-full"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                  )}

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        nextStep();
                      }}
                      className="w-full"
                    >
                      Continuar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading || isSuccess}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Criando conta...
                        </div>
                      ) : isSuccess ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle size={18} />
                          Conta criada!
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <UserPlus size={18} />
                          Criar conta
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>

            {currentStep === 1 && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 text-muted-foreground">Ou continue com</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" disabled>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Cadastro com Google (em manutenção)
                </Button>
              </>
            )}

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link 
                href="/login" 
                className="text-primary font-medium hover:underline"
              >
                Fazer login
              </Link>
            </div>

            <div className="text-center">
              <Link 
                href="/" 
                className="text-sm text-muted-foreground hover:text-primary hover:underline"
              >
                ← Voltar ao início
              </Link>
            </div>

            {currentStep === 3 && (
              <div className="text-xs text-center text-muted-foreground">
                Ao criar uma conta, você concorda com nossos{" "}
                <Link href="/terms" className="hover:underline">Termos de Uso</Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}>
      <RegisterContent />
    </Suspense>
  );
}