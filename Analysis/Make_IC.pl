#####################
# perl Make_IC.pl
# Created Jul 27th
# to calculate IC 
# for each position
# for all 30 factors
# hebin
#####################

open f_Output, ">../OptimalPatserMatrices/InfoContent.txt";
$k = 1; #pseudo-count;
@factor = qw(Antp Deaf1 Dfd Kr Mad Trl Ubx abd-A ap bcd br-Z1 br-Z2 br-Z3 brk cad dl en eve hb kni ovo pan prd slbo tin tll twi vvl z zen);
(%pwml) = ();

foreach $factor(@factor){
    (@IC) = ();
    $IC = 0;
    open f_Input, "../OptimalPatserMatrices/$factor" || die "cannot open matrix file\n";
    @A = split(/\s+/, <f_Input>);
    @C = split(/\s+/, <f_Input>);
    @G = split(/\s+/, <f_Input>);
    @T = split(/\s+/, <f_Input>);
    $pwml{$factor} = scalar(@A) - 2;
    for $i(2..$#A){
	$A[$i] += $k*0.3;
	$C[$i] += $k*0.2;
	$G[$i] += $k*0.2;
	$T[$i] += $k*0.3;
	$IC = $A[$i]*log($A[$i]/((100+$k)*0.3))
	     +$C[$i]*log($C[$i]/((100+$k)*0.2))
	     +$G[$i]*log($G[$i]/((100+$k)*0.2))
	     +$T[$i]*log($T[$i]/((100+$k)*0.3));
	$IC = int($IC/(100+$k)*1000)/1000;
	push @IC, $IC;
    }
    print "$factor\t$pwml{$factor}\n", join(' ', @IC), "\n";
}
