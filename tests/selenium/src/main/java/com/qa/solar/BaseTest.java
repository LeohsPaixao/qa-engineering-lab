package com.qa.solar;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.WebDriverManager;
import io.github.cdimascio.dotenv.Dotenv;

/**
 * Classe base para todos os testes Selenium
 * Fornece configurações comuns e métodos utilitários
 */
public abstract class BaseTest {

    private Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

    protected WebDriver driver;

    /**
     * Configura o driver e inicia o navegador
     */
    protected WebDriver setUp() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();

        boolean headless = Boolean.parseBoolean(dotenv.get("HEADLESS", "false"));
        if (headless) {
            options.addArguments("--headless=new");
            options.addArguments("--window-size=1920,1080");
        }

        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--remote-allow-origins=*");

        driver = new ChromeDriver(options);

        return driver;
    }

    /**
     * Encerra o driver e fecha o navegador
     */
    protected void tearDown() {
        driver.quit();
    }

    /**
     * Navega para uma URL específica
     */
    protected void navigateTo(String url) {
        if (driver == null) {
            throw new IllegalStateException("WebDriver não inicializado. Chame setUp() antes de navegar.");
        }
        String input = (url == null) ? "" : url.trim();
        String target;

        if (input.startsWith("http://") || input.startsWith("https://")) {
            target = input;
        } else {
            String base = dotenv.get("SELENIUM_BASE_URL", "http://localhost:8181");
            try {
                target = java.net.URI.create(base).resolve(input).toString();
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("URL inválida: '" + input + "' com base '" + base + "'", e);
            }
        }
        driver.get(target != null ? target : "");
    }

    /**
     * Aguarda um tempo específico em segundos
     */
    protected void waitForSeconds(int seconds) {
        try {
            Thread.sleep(seconds * 1000L);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    /**
     * Aguarda até que um elemento seja visível
     */
    protected WebElement waitForElementVisible(WebElement element, int duration) {
        if (driver == null) {
            throw new IllegalStateException("WebDriver não inicializado. Chame setUp() antes de aguardar o elemento.");
        }
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(duration));
        wait.until(ExpectedConditions.visibilityOf(element));
        return element;
    }

    /**
     * Aguarda até que um elemento seja localizado e visível
     */
    protected WebElement waitForElementLocated(By locator, int duration) {
        if (driver == null) {
            throw new IllegalStateException("WebDriver não inicializado. Chame setUp() antes de aguardar o elemento.");
        }
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(duration));
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    /**
     * Aguarda até que múltiplos elementos sejam localizados e visíveis
     */
    protected List<WebElement> waitForElementsLocated(By locator, int duration) {
        if (driver == null) {
            throw new IllegalStateException(
                    "WebDriver não inicializado. Chame setUp() antes de aguardar os elementos.");
        }
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(duration));
        return wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(locator));
    }
}
