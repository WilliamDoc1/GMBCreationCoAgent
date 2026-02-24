"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabase';
import { useTenant } from '@/hooks/use-tenant';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  full_name: z.string().min(2, "Name is too short"),
  phone_number: z.string().min(10, "Invalid phone number"),
});

interface AddCustomerFormProps {
  onSuccess: () => void;
}

const AddCustomerForm = ({ onSuccess }: AddCustomerFormProps) => {
  const { tenant } = useTenant();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!tenant) {
      showError("Business profile not loaded. Please refresh.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('customers')
        .insert([{ 
          full_name: values.full_name,
          phone_number: values.phone_number,
          tenant_id: tenant.id,
          status: 'new'
        }]);

      if (error) throw error;

      showSuccess("Customer added successfully");
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error("Error adding customer:", error);
      showError(error.message || "Failed to add customer");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+27..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
          Add Customer
        </Button>
      </form>
    </Form>
  );
};

export default AddCustomerForm;