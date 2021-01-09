#################################
# perl Gain_loss.pl
# Created Jul 25th 08
# To estimate the number of 
# mel-gained and sim-lost sites
# hebin
#! /usr/bin/perl -W
#################################


use DBI;
prepareDbh();

###############
# loading pwm #
###############
open f_Input, "../OptimalPatserMatrices/weight_matrix.txt" ||
    die "Cannot open weight_matrix.txt";
(%pwml) = ();
($ref) = ();
while(!eof(f_Input)){
    $line = <f_Input>;
    $line =~ /Matrices\/(\S+)\"\:\ (\d+)/;
    $factor = $1; $width = $2;
    $pwml{$factor} = $width;
    $ref{$factor} = 0;
    (@$factor) = ();
    <f_Input>;
    for($i = 0; $i < $width; $i ++){
	$line = <f_Input>;
	(@array) = ();
	@array = split(/\s+/, $line);
	$array[0] ne '' || shift(@array);#discard the first empty element;
	push(@$factor, @array);
	#pick the highest score and add to the ref;
	$ref{$factor} += max(@array);
    }
    #print "$factor uploaded\n";
    <f_Input>;
}
close(f_Input);
%cutoff = qw(Dfd 4.45 zen 2.39 prd 3.11 pan 0.57 tll 0.88 twi 0.08 Deaf1 4.29 bcd 3.1 ovo 5.16 hb 5.17 abd-A 1.53 slbo 2.18 tin 8.21 kni -0.69 cad -2.36 brk 6.6 br-Z1 1.97 en 2.4 Ubx 0.9 br-Z3 1.68 Mad 3.38 Antp 3.2 br-Z2 1.24 Kr -0.27 eve 2.69 Trl 0.38 ap 1.59 z 4.61 dl 1.38 vvl 2.99);

## driving table: tfbs ##
$sth = $dbh->prepare(qq(SELECT fpid, factor,region, tfbs_start, tfbs_end, anc_score, strand
			FROM tfbs 
			WHERE gapped = 'N'));
$sth->execute;
(@array) = (); #0:fpid; 1:factor; 2:region; 3:tfbs_start; 4:tfbs_end; 5:anc_score; 6:strand;
while(@array = $sth->fetchrow_array){
    $factor = $array[1];
    $region = $array[2];
    $strand = $array[6];
    #####################
    # construct binding
    # sites alignment
    #####################
    $sth3 = $dbh->prepare(qq(SELECT anc, mel, sim_alleles
			     FROM tfbs_poly
			     WHERE region = '$region' AND coordinate between $array[3] and $array[4]));
    $sth3->execute;
    (@array2) = ();
    $anc_seq = '';$mel_seq = ''; $sim_seq = '';
    while(@array2 = $sth3->fetchrow_array){
	$mel_seq = $mel_seq.$array2[1];
	if($array2[0] ne '?'){
	    $anc_seq = $anc_seq.$array2[0];
	}else{
	    $anc_seq = $anc_seq.$array2[1];
	}
	(@sim) = ();$temp = '';
	@sim = split(/\s+/, $array2[2]);
	do{
	    $temp = shift(@sim);
	}until($temp ne 'N' || @sim == 0);
	$sim_seq = $sim_seq.$temp;
    }
    $mel_s = score($mel_seq);
    $sim_s = score($sim_seq);
    $anc_s = score($anc_seq);
    $mel_flag = $sim_flag = $anc_flag = 0;
    $mel_flag = $mel_s > $cutoff{$factor} ? 1:0;
    $sim_flag = $sim_s > $cutoff{$factor} ? 1:0;
    $anc_flag = $anc_s > $cutoff{$factor} ? 1:0;
    $mel_flag = $mel_s > 0 ? 1:0;
    $sim_flag = $sim_s > 0 ? 1:0;
    $anc_flag = $anc_s > 0 ? 1:0;
    print "$region\t$factor\t$anc_flag\t$mel_flag\t$sim_flag\n";
}
$sth->finish;
$dbh->disconnect;

sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}

sub score
{
    my $window = shift;
    my $plus = $window;
    $plus =~ tr/ACGT/0123/;
    my $minus = revcomp($window);
    $minus =~ tr/ACGT/0123/;
    my $splus = my $sminus = 0;
    for $j(0..($pwml{$factor}-1)){
	if(substr($plus, $j ,1) eq 'N'){
	    $splus += ($$factor[4*$j]+$$factor[4*$j+3])*0.3+($$factor[4*$j+2]+$$factor[4*$j+1])*0.2;
	    $sminus += ($$factor[4*$j]+$$factor[4*$j+3])*0.3+($$factor[4*$j+2]+$$factor[4*$j+1])*0.2;
	}else{
	    $splus += $$factor[4*$j+substr($plus, $j, 1)];
	    $sminus += $$factor[4*$j+substr($minus, $j, 1)];
	}
    }
    my $score = $splus >= $sminus ? $splus:$sminus;
    my $Pi = 0;
    $Pi = 1/(exp($ref{$factor}-$score)+1);
    return $score;
}

sub revcomp
{
    my $seq = shift;
    $seq =~ tr/ACGT/TGCA/;
    return join('',reverse(split(//, $seq)));
}

sub max
{
    my @array = @_;
    for $i(1..$#array){
	if($array[$i-1] > $array[$i]){
	    @array[$i-1, $i] = @array[$i, $i-1];
	}
    }
    return $array[-1];
}
