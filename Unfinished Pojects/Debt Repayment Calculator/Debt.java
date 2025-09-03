public class Debt implements Cloneable{
    private String name;
    private double balance;
    private double InterestRate;
    private double minPayment;

    public Debt(String name, double balance, double InterestRate, double minPayment){
        this.name = name;
        this.balance = balance;
        this.InterestRate = InterestRate;
        this.minPayment = minPayment;
    }

    // Getters
    public String getName() {
        return name;
    }   
    public double getBalance() {
        return balance;
    }
    public double getInterestRate() {
        return InterestRate;
    }
    public double getMinPayment() {
        return minPayment;
    }

    // Setters
    public void setBalance(double balance) {
        this.balance = balance;
    }

    // Calculate monthly interest
    public double calculateMonthlyInterest() {
        return (InterestRate / 100) / 12 * balance;
    }

    @Override
    public String toString() {
        return String.format("%s: Balance=%.2f, Interest Rate=%.2f%%, Min Payment=%.2f", 
                             name, balance, InterestRate, minPayment);
    }
    protected Debt clone() {
        return new Debt(name, balance, InterestRate, minPayment);
    }
}
