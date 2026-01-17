package com.qa.solar.steps;

import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.Assertions;

import io.cucumber.java.pt.Dado;
import io.cucumber.java.pt.Quando;

/**
 * Exemplo de classe de steps do Cucumber
 * 
 * Este arquivo serve como referência para criar novos steps.
 * Você pode deletá-lo quando começar a criar seus próprios steps.
 * 
 * @author Leonardo Paixão
 * @version 1.0
 * @since 2026-01-17
 */
public class ExampleSteps {

    @Dado("que eu tenho um exemplo de step")
    public void queEuTenhoUmExemploDeStep() {
        System.out.println("Exemplo de step executado");
    }

    @Quando("eu executar uma ação")
    public void euExecutarUmaAcao() {
        AtomicInteger a = new AtomicInteger(1);
        int b = 2;
        int c = a.addAndGet(b);
        Assertions.assertEquals(3, c);
    }
}
