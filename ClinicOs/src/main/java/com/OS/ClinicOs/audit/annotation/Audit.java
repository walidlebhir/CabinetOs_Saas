package com.OS.ClinicOs.audit.annotation;

import com.OS.ClinicOs.audit.Infra.Entity.Enum.Action;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Audit {

    Action operation() default Action.READ ;

    String description() default "" ;
}
