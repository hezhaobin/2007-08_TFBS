##############################
#  perl annotation.pl
#! /usr/bin/perl -w
#  Created Sep 6th 2007
#  Modified Dec 1st 2007
#  To predict the best match
#  to pwm in mel and annotate
#  the mysql tables
#  Modified Jan 7th 2008
#  To examine the orientation
#  of binding sites
#  Hebin
##############################


use DBI;
prepareDbh();
open(f_Output, ">best_match_PWM.gff");#to store the predition information;

$time = `date`;
#commented out on Jan 7 08#print f_Output '#Created by hebin at ', $time, "#Predict best match to pwm in footprints from FlyReg\n";

$flank = 5;

#initialize the database
if(0){
$dbh -> do(qq(UPDATE tfbs_poly p, tfbs t
	      SET p.tf_name = 'bs'
	      WHERE p.coordinate between t.fp_start-$flank and t.fp_end+$flank));
$dbh -> do(qq(UPDATE tfbs_poly
	      SET tf_name = 'spacer'
	      WHERE tf_name is NULL));
$dbh -> do(qq(UPDATE tfbs_poly
	      SET tf_name = NULL
	      WHERE tf_name = 'bs'));
}
########################
# loop through regions #
########################
$sth2 = $dbh -> prepare(qq(select * from enhancer));
$sth2->execute;
$sth2->bind_columns(\$region, \$chr_arm, \$region_start, \$region_end);

while($sth2->fetch){
    ####################
    # Retrieve all the 
    # binding sites
    # location within
    # the region
    ####################
    $sth = $dbh -> prepare(qq(select t.region, t.fpid, t.chr_arm, t.factor, t.target, t.fp_start, t.fp_end 
			      from enhancer as e, tfbs as t 
			      where e.region = '$region' AND t.chr_arm = e.chr_arm AND t.fp_start between e.start and e.end order by t.fpid));
    $sth -> execute();
    #@species = ('mel', 'c1674', 'md106', 'md199', 'newc', 'sim46', 'w501');
    (@array) = ();
    while(@array = $sth -> fetchrow_array()){
	#$patser_seq = '';
	#$align_seq = '';
	($region,$fpid, $chr_arm, $factor, $target, $fp_start, $fp_end) = @array[0..6];
	next unless (-e "/Users/hebin/Documents/tfbs/OptimalPatserMatrices/$factor"); ## skip if pwm for the factor is not available
	########################
	#  Get the sequence
	#  from tfbs_poly
	#  for the footprints
	########################
	$sth1 = $dbh->prepare(qq(select coordinate, mel 
				 from tfbs_poly
				 where chr_arm = '$chr_arm' AND coordinate between $fp_start-$flank and $fp_end+$flank));
	if($sth1->execute() eq '0E0'){ ##examine if I have the sequence for the footprints;
	    print "no data for $fpid\n";
	    next;
	}
	$record = '';
	$sth1->bind_columns(\$coordinate, \$mel);
	$l = 0; #length of the sequence;
	$sth1->fetch;
	$seq = $mel;
	$antiseq = $mel;
	$seq_begin = $coordinate;##record the coordinate of the first base pair;
	while($sth1->fetch){
	    $l ++;
	    $record = $record."$coordinate\t$mel\n";
	    $seq = $seq.$mel;
	    $antiseq = $mel.$antiseq;
	}
	$sth1->finish;
	$seq =~ tr/\-//d;
	$antiseq =~ tr/\-//d;
	$patser_seq = 'mel'."\t\\".$seq."\\\n".'anti'."\t\\".$antiseq."\\\n";
	#predicting the best match;
	$result = `echo -n '$patser_seq' | 
                  ~/Documents/tfbs/patser/patser -A a:t 0.3 c:g 0.2 -m ~/Documents/tfbs/OptimalPatserMatrices/$factor -b 1 -u2 -s -c -t|
                  grep "width of the alignment matrix:\\|position="`;
	if($result eq ''){
	    print "Motif not found for $fpid\n";
	    next;
	}
	$result =~ /width of the alignment matrix:\s+(\d+)/;
	$width = $1;
	($position,$score, $multiple) = $result =~ /mel\s+position=\s+(\d+C?)\s+score=\s+(\S+)\s+/g;
	($anti_position,$anti_score, $anti_multiple) = $result =~ /anti\s+position=\s+(\d+C?)\s+score=\s+(\S+)\s+/g;
	if($anti_score > $score){
	    print "$fpid\n$seq\n$antiseq\n$result";
	    getc();
	}
	$sign = $position !~ /C/;
	if($sign){
	    $strand = "+";
	}else{
	    $position =~ tr/C//d;
	    $strand = "-";
	}
	$tfbs_start = $seq_begin + $position -1;
	$tfbs_end = $tfbs_start + $width -1;
	if(0){
	    $dbh -> do(qq(UPDATE tfbs_poly 
			  SET tf_name = "bs"
			  WHERE coordinate between $tfbs_start and $tfbs_end AND region = '$region'));
	    #check that I've done the right thing;
	    $bs_seq = substr($seq, $position - 1, $width);
	    $annotated_seq = substr($line, $start -$region_start + $position -1, $width);
	    die "$bs_seq\n$annotated_seq\n$factor\t$region\t$tfbs_start\t$tfbs_end" unless (uc($bs_seq) eq uc($annotated_seq));
	}
	#print the gff file;
	print f_Output "$fpid\t$chr_arm\t$factor\t$tfbs_start\t$tfbs_end\t$score\t$strand\t.\tFactor=$factor;Target=$target;Region=$region\n";
	if($multiple ne ''){
	    #print $record,"$factor\t$result";
	}
    }
    $sth -> finish();
}
$sth2->finish;
$dbh -> disconnect;

sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
sub align
{
    my $seq = shift;
    my (@seq) = split(//, $seq);
    my (@ref) = split(//, $seq{'mel'});
    my $length = length($seq);
    my $i = 0;
    for($i = 0; $i < $length; $i ++){
	if($seq[$i] eq $ref[$i]){
	    $seq[$i] = '.';
	}
    }
    return join("", @seq);
}
