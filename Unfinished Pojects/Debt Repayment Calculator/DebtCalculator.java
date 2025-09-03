import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class DebtCalculator {
    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Welcome to the Debt Payoff Calculator!");


        System.out.println("Samantha R. Morgan(29AUG2025)");

        // Collect User Debts
        List<Debt> debts = new ArrayList<>();
        double totalDebt = 0.0;
        double totalMinPayment = 0.0;

        System.out.print("Enter your debts. Type 'done' when finished.\n");
        while(true){
            System.out.print("Debt name:");
            String name = scanner.nextLine().trim();
            if (name.equalsIgnoreCase("done")) break;

            try {
                System.out.println("Balance: $:");
                double balance = Double.parseDouble(scanner.nextLine().trim());
                System.out.println("Annual Interest Rate %:");
                double InterestRate = Double.parseDouble(scanner.nextLine().trim());
                System.out.println("Minimum Payment $:");
                double minPayment = Double.parseDouble(scanner.nextLine().trim());

                Debt debt = new Debt(name, balance, InterestRate, minPayment);
                debts.add(debt);
                totalDebt += balance;
                totalMinPayment += minPayment;
            } catch (NumberFormatException e){
                System.out.println("Invalid input. Please enter numbers only.");
            }
        }

        // Display Debt Table
        System.out.println("\nYour Debts:");
        System.out.printf("%-20s %-10s %-10s %-15s\n", "Name", "Balance", "Interest Rate", "Min Payment");
        for (Debt d : debts) {
            System.out.printf("%-20s $%-9.2f %-10.2f $%-14.2f\n", d.getName(), d.getBalance(), d.getInterestRate(), d.getMinPayment());
        }
        System.out.printf("\nTotal Debt: $%.2f\nTotal Minimum Payments: $%.2f\n", totalDebt, totalMinPayment);

        //Run Payoff Simulation
        Payoff simulator = new Payoff(debts, totalMinPayment, totalDebt);
        simulator.runPayoffSimulation();

        // Offer to run other method for comparison
        System.out.print("\nWould you like to see the other method? (y/n): ");
        if (scanner.nextLine().trim().equalsIgnoreCase("y")) {
            Payoff otherSimulator = new Payoff(debts, totalMinPayment, totalDebt);
            otherSimulator.runPayoffSimulation();
        }

        scanner.close();
    }

    
}
